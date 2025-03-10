import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig"; // Ensure this path is correct
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const SearchBloodStockComponent = ({ subheadingText, headingText, classHint }) => {
	const [bloodGroup, setBloodGroup] = useState(""); // Stores selected blood group
	const [bloodStock, setBloodStock] = useState([]); // Stores all blood stock from Firestore
	const [filteredStock, setFilteredStock] = useState([]); // Stores filtered blood stock
	const [loading, setLoading] = useState(true); // Tracks loading state

	// Fetch blood stock from Firestore
	useEffect(() => {
		const fetchBloodStock = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "blood_stock"));
				const bloodStockData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setBloodStock(bloodStockData);
				setFilteredStock(bloodStockData); // Initially, show all stock
			} catch (error) {
				console.error("Error fetching blood stock:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBloodStock();
	}, []);

	// Handle blood group selection & update filtered data
	const handleBloodGroupChange = (e) => {
		const selectedBloodGroup = e.target.value;
		setBloodGroup(selectedBloodGroup);

		// Filter stock based on selected blood type
		if (selectedBloodGroup) {
			const newFilteredStock = bloodStock.filter(
				(stock) => stock.bloodType === selectedBloodGroup // ✅ Updated field name
			);
			setFilteredStock(newFilteredStock);
		} else {
			setFilteredStock(bloodStock); // Reset to all stock if no selection
		}
	};

	return (
		<WrapperSection>
			<div
				className={`${classHint} bg-off_white wrapper flex flex-col justify-center items-center w-full relative p-6 py-10 sm:py-20 sm:p-20 rounded-rmd z-[25] overflow-hidden`}
			>
				<GroupedHeadingComponent subheadingText={subheadingText} headingText={headingText} mode="dark" position="center" />
				<div className="w-full mt-10">
					<form className="grid grid-cols-1 sm:grid-cols-6 gap-2 w-full">
						<select
							name="bloodGroup"
							id="bloodGroup"
							className="w-full p-5 border sm:col-span-4 border-none bg-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
							onChange={handleBloodGroupChange} // Updated filtering
							value={bloodGroup}
						>
							<option value="">-- Select Blood Group --</option>
							<option value="A+">A+</option>
							<option value="A-">A-</option>
							<option value="B+">B+</option>
							<option value="B-">B-</option>
							<option value="AB+">AB+</option>
							<option value="AB-">AB-</option>
							<option value="O+">O+</option>
							<option value="O-">O-</option>
						</select>
						<button type="button" className="sm:col-span-2 sm:rounded-r-rsm border-dark text-white bg-dark hover:border-dark hover:bg-dark_red hover:text-white transition text-black px-8 py-5 text-sm font-bold">
							Search Availability
						</button>
					</form>

					<div className="mt-10 w-full bg-[#d9d9d9] rounded-rsm p-5 justify-start items-start overflow-x-scroll">
						{loading ? (
							<p className="text-center text-lg">Loading blood stock...</p>
						) : filteredStock.length > 0 ? (
							<table className="w-full overflow-x-scroll">
								<thead>
									<tr className="grid grid-cols-6 text-start mb-5 border-b border-off_white pb-5">
										<th className="col-span-2 text-start text-sm uppercase tracking-widest text-red">Blood Type</th>
										<th className="col-span-2 text-start text-sm uppercase tracking-widest text-red">Location</th>
										<th className="col-span-2 text-start text-sm uppercase tracking-widest text-red">Availability</th>
									</tr>
								</thead>
								<tbody>
									{filteredStock.map((stock) => (
										<tr key={stock.id} className="grid grid-cols-6 text-start mb-2 border-b border-off_white pb-3">
											<td className="col-span-2 text-start sm:text-xl font-semibold">{stock.bloodType}</td>
											<td className="col-span-2 text-start sm:text-xl font-semibold">{stock.location}</td>
											<td className="col-span-2 text-start sm:text-xl font-semibold">
												{stock.quantity > 0 ? `Available (${stock.quantity})` : "Not Available"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<p className="text-center text-lg">No stock available</p>
						)}
					</div>
				</div>
			</div>
		</WrapperSection>
	);
};

export default SearchBloodStockComponent;
