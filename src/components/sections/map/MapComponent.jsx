import { useEffect, useState, useRef } from 'react';
import './MapComponent.css';

const MapComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [bloodBanks, setBloodBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);
    const [mapInitialized, setMapInitialized] = useState(false);

    // Load Leaflet and initialize map
    useEffect(() => {
        console.log('Starting to load Leaflet...');
        
        // Create a script element for Leaflet
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        
        // Create a link element for Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        
        // Append CSS to head
        document.head.appendChild(leafletCSS);
        
        // Set up script load handler
        leafletScript.onload = () => {
            console.log('Leaflet script loaded successfully');
            
            // Wait a bit to ensure DOM is ready
            setTimeout(() => {
                if (mapRef.current) {
                    console.log('Map container found, initializing map...');
                    getUserLocation();
                } else {
                    console.log('Map container not found after timeout');
                    setError('Map container not found. Please refresh the page.');
                    setLoading(false);
                }
            }, 500);
        };
        
        // Set up script error handler
        leafletScript.onerror = () => {
            console.log('Failed to load Leaflet script');
            setError('Failed to load map library. Please check your internet connection and refresh the page.');
            setLoading(false);
        };
        
        // Append script to body
        document.body.appendChild(leafletScript);
        
        // Cleanup function
        return () => {
            document.head.removeChild(leafletCSS);
            document.body.removeChild(leafletScript);
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
        };
    }, []);

    // Get user's current location
    const getUserLocation = () => {
        console.log('Getting user location...');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`User location obtained: ${latitude}, ${longitude}`);
                    initializeMap([latitude, longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    console.log(`Error getting location: ${error.message}`);
                    setError("Unable to get your location. Using default location.");
                    // Default to a central location in India if geolocation fails
                    initializeMap([20.5937, 78.9629]);
                }
            );
        } else {
            console.log('Geolocation not supported');
            setError("Geolocation is not supported by your browser. Using default location.");
            // Default to a central location in India
            initializeMap([20.5937, 78.9629]);
        }
    };

    // Initialize the map
    const initializeMap = (center) => {
        console.log('Initializing map...');
        
        try {
            if (!window.L) {
                throw new Error('Leaflet not loaded');
            }
            
            if (!mapRef.current) {
                throw new Error('Map container not found');
            }
            
            // Ensure the map container is visible and has dimensions
            mapRef.current.style.height = '500px';
            mapRef.current.style.width = '100%';
            mapRef.current.style.display = 'block';
            
            // Create map instance
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
            
            // Create the map with explicit container dimensions
            mapInstance.current = window.L.map(mapRef.current, {
                center: center,
                zoom: 13,
                zoomControl: true,
                attributionControl: true
            });
            
            console.log('Map instance created');
            
            // Add OpenStreetMap tile layer
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
            
            // Create a layer group for markers
            markersLayer.current = window.L.layerGroup().addTo(mapInstance.current);
            
            // Add a marker for the user's location
            window.L.marker(center).addTo(markersLayer.current)
                .bindPopup("Your Location")
                .openPopup();
            
            console.log('Map initialized successfully');
            setMapInitialized(true);
            
            // Force a resize to ensure the map renders correctly
            setTimeout(() => {
                if (mapInstance.current) {
                    mapInstance.current.invalidateSize();
                    console.log('Map size invalidated');
                    
                    // Search for blood banks near the location
                    searchNearbyBloodBanks(center);
                    setLoading(false);
                }
            }, 300);
            
        } catch (err) {
            console.error("Error initializing map:", err);
            console.log(`Error initializing map: ${err.message}`);
            setError(`Failed to initialize map: ${err.message}. Please refresh the page and try again.`);
            setLoading(false);
        }
    };

    // Helper function to format address
    const formatAddress = (tags) => {
        const addressParts = [];
        
        // Try to get the most complete address possible
        if (tags["addr:street"]) {
            const street = tags["addr:street"];
            const houseNumber = tags["addr:housenumber"] || '';
            addressParts.push(`${street} ${houseNumber}`.trim());
        }
        
        // Include district/suburb information
        if (tags["addr:suburb"]) {
            addressParts.push(tags["addr:suburb"]);
        } else if (tags["addr:district"]) {
            addressParts.push(tags["addr:district"]);
        } else if (tags["addr:neighbourhood"]) {
            addressParts.push(tags["addr:neighbourhood"]);
        }
        
        // Add postal code if available
        if (tags["addr:postcode"]) {
            addressParts.push(tags["addr:postcode"]);
        }
        
        if (tags["addr:city"]) {
            addressParts.push(tags["addr:city"]);
        }
        
        if (tags["addr:state"]) {
            addressParts.push(tags["addr:state"]);
        }
        
        // If we have no address parts, try alternative fields
        if (addressParts.length === 0) {
            if (tags["addr:full"]) {
                addressParts.push(tags["addr:full"]);
            } else if (tags.address) {
                addressParts.push(tags.address);
            }
        }
        
        // If all else fails, try to extract location from OSM tags
        if (addressParts.length === 0) {
            if (tags.name) {
                addressParts.push(tags.name);
            }
            
            // Try to get approximate location from OSM tags
            const locationTags = [
                'location', 'loc_name', 'place', 'area',
                'building', 'landmark', 'site', 'locality'
            ];
            
            for (const tag of locationTags) {
                if (tags[tag]) {
                    addressParts.push(tags[tag]);
                    break;
                }
            }
        }
        
        // If we still have no address, return a default message
        if (addressParts.length === 0) {
            return "Address not available";
        }
        
        return addressParts.join(', ');
    };
    
    // Function to log all available address tags for debugging
    const logAddressTags = (tags) => {
        const addressTags = {};
        for (const key in tags) {
            if (key.startsWith('addr:') || 
                ['name', 'location', 'loc_name', 'place', 'area', 
                 'building', 'landmark', 'site', 'locality'].includes(key)) {
                addressTags[key] = tags[key];
            }
        }
        console.log("Available address tags:", addressTags);
        return addressTags;
    };

    // Search for blood banks near a location using Overpass API (OpenStreetMap data)
    const searchNearbyBloodBanks = (center) => {
        console.log('Searching for blood banks...');
        const [lat, lng] = center;
        const radius = 5000; // 5km radius
        
        // Using a more reliable Overpass API endpoint with additional address data
        const overpassQuery = `
            [out:json][timeout:25];
            (
              node["healthcare"="blood_donation"](around:${radius},${lat},${lng});
              node["amenity"="hospital"](around:${radius},${lat},${lng});
              node["healthcare"="hospital"](around:${radius},${lat},${lng});
              node["healthcare"="blood_bank"](around:${radius},${lat},${lng});
            );
            out body;
        `;
        
        const encodedQuery = encodeURIComponent(overpassQuery);
        // Using multiple Overpass API endpoints for redundancy
        const apiUrls = [
            `https://overpass-api.de/api/interpreter?data=${encodedQuery}`,
            `https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=${encodedQuery}`,
            `https://overpass.kumi.systems/api/interpreter?data=${encodedQuery}`
        ];
        
        // Try each API endpoint until one works
        const tryNextEndpoint = async (urls, index = 0) => {
            if (index >= urls.length) {
                setError("All API endpoints failed. Please try again later.");
                return;
            }
            
            try {
                const response = await fetch(urls[index]);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Process the results
                const results = data.elements.filter(element => 
                    element.type === 'node' && element.tags
                );
                
                console.log(`Found ${results.length} blood banks/hospitals`);
                
                // Log the first result's tags to help debug available data
                if (results.length > 0) {
                    console.log("Sample facility data:");
                    logAddressTags(results[0].tags);
                }
                
                setBloodBanks(results);
                
                // Add markers for each blood bank
                results.forEach(place => {
                    const marker = window.L.marker([place.lat, place.lon]).addTo(markersLayer.current);
                    
                    // Create popup content
                    const name = place.tags.name || "Blood Bank/Hospital";
                    const address = formatAddress(place.tags);
                    const type = place.tags.healthcare || place.tags.amenity || "Medical Facility";
                    const phone = place.tags.phone || place.tags["contact:phone"] || "";
                    
                    const popupContent = `
                        <div>
                            <h3>${name}</h3>
                            <p>${address}</p>
                            <p>Type: ${type}</p>
                            ${phone ? `<p>Phone: ${phone}</p>` : ''}
                            <p>Coordinates: ${place.lat.toFixed(6)}, ${place.lon.toFixed(6)}</p>
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                });
                
                if (results.length === 0) {
                    setError("No blood banks found in this area. Try expanding your search.");
                } else {
                    setError(null);
                }
            } catch (err) {
                console.error(`Error with API endpoint ${index + 1}:`, err);
                console.log(`Error with API endpoint ${index + 1}: ${err.message}`);
                // Try the next endpoint
                tryNextEndpoint(urls, index + 1);
            }
        };
        
        tryNextEndpoint(apiUrls);
    };

    // Handle manual search using Nominatim (OpenStreetMap's geocoding service)
    const handleSearch = (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        console.log(`Searching for location: ${searchQuery}`);
        
        // Use Nominatim for geocoding
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;
        
        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                    console.log(`Location found: ${location}`);
                    
                    // Center map on the searched location
                    if (mapInstance.current) {
                        // Clear previous markers
                        if (markersLayer.current) {
                            markersLayer.current.clearLayers();
                        }
                        
                        // Add a marker for the searched location
                        window.L.marker(location).addTo(markersLayer.current)
                            .bindPopup("Searched Location")
                            .openPopup();
                        
                        // Center the map on the new location
                        mapInstance.current.setView(location, 13);
                        
                        // Force a resize to ensure the map renders correctly
                        setTimeout(() => {
                            if (mapInstance.current) {
                                mapInstance.current.invalidateSize();
                                console.log('Map size invalidated after search');
                            }
                        }, 100);
                        
                        // Search for blood banks near the searched location
                        searchNearbyBloodBanks(location);
                    } else {
                        console.log('Map instance not available for search');
                        setError("Map not initialized. Please refresh the page.");
                    }
                    
                    setLoading(false);
                } else {
                    console.log('Location not found');
                    setError("Location not found. Please try a different search term.");
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Error searching location:", err);
                console.log(`Error searching location: ${err.message}`);
                setError("Failed to search location. Please try again later.");
                setLoading(false);
            });
    };

    // Force map to render correctly when it becomes visible
    useEffect(() => {
        if (!loading && mapInstance.current) {
            setTimeout(() => {
                mapInstance.current.invalidateSize();
                console.log('Map size invalidated after loading');
            }, 500);
        }
    }, [loading]);

    return (
        <div className="map-container">
            <h2 className="map-title">Find Nearby Blood Banks</h2>
            
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter a location to search"
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="map-wrapper">
                {loading && !mapInitialized ? (
                    <div className="loading">Loading map... Please wait.</div>
                ) : (
                    <div ref={mapRef} id="map" className="leaflet-map"></div>
                )}
            </div>
            
            {bloodBanks.length > 0 && (
                <div className="blood-banks-list">
                    <h3>Nearby Blood Banks ({bloodBanks.length})</h3>
                    <div className="blood-banks-scroll">
                        <ul>
                            {bloodBanks.map((bank, index) => (
                                <li key={index} className="blood-bank-item">
                                    <h4>{bank.tags.name || "Blood Bank/Hospital"}</h4>
                                    <p>{formatAddress(bank.tags)}</p>
                                    <p>Type: {bank.tags.healthcare || bank.tags.amenity || "Medical Facility"}</p>
                                    {(bank.tags.phone || bank.tags["contact:phone"]) && (
                                        <p>Phone: {bank.tags.phone || bank.tags["contact:phone"]}</p>
                                    )}
                                    <p className="coordinates">Coordinates: {bank.lat.toFixed(6)}, {bank.lon.toFixed(6)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
