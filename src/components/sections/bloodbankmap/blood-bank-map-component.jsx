import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const BloodBankMapComponent = () => {
    const [location, setLocation] = useState({ lat: "", lng: "" });
    const [bloodBanks, setBloodBanks] = useState([]);
    const [place, setPlace] = useState("");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                fetchBloodBanks(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    // Function to fetch coordinates from place name
    const fetchCoordinates = async () => {
        if (!place) return;
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
        
        try {
            const response = await axios.get(url);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                fetchBloodBanks(lat, lon);
            } else {
                console.error("Location not found");
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    // Function to fetch nearby blood banks
    const fetchBloodBanks = async (lat, lon) => {
        if (!lat || !lon) {
            console.error("Invalid coordinates");
            return;
        }

        const overpassQuery = `
            [out:json];
            node(around:5000, ${lat}, ${lon})["amenity"="blood_bank"];
            out;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            const response = await axios.get(url);
            const banks = response.data.elements.map((bank) => ({
                id: bank.id,
                lat: bank.lat,
                lon: bank.lon,
                name: bank.tags.name || "Unknown Blood Bank",
            }));
            setBloodBanks(banks);
        } catch (error) {
            console.error("Error fetching blood banks:", error);
        }
    };

    return (
        <div style={{ height: "500px", width: "100%" }}>
            {/* Input Field for Place Name Search */}
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Enter a place name (e.g., Mumbai, New York)"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    style={{ marginRight: "5px", padding: "5px", width: "250px" }}
                />
                <button onClick={fetchCoordinates} style={{ padding: "5px 10px", cursor: "pointer" }}>
                    Search
                </button>
            </div>

            {/* Map Container */}
            <div style={{ height: "400px", width: "100%" }}>
                {location.lat && location.lng ? (
                    <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>Selected Location</Popup>
                        </Marker>
                        {bloodBanks.map((bank) => (
                            <Marker key={bank.id} position={[bank.lat, bank.lon]}>
                                <Popup>{bank.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <p>Fetching your location...</p>
                )}
            </div>
        </div>
    );
};

export default BloodBankMapComponent;