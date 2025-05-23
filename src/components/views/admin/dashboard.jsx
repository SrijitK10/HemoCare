import React, { useState, useEffect } from "react";
import CardStats from "../../sections/cta-card/cta-card-component";
import HeaderStats from "../../sections/header-stats/header_stats";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDatabase } from "../../../contexts/DatabaseContext";

import { BiDonateBlood, BiHelpCircle } from "react-icons/bi";
import { MdOutlineBloodtype } from "react-icons/md";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import CardLineChart from "../../sections/chart/chart-component";
import FilterableComponent from "../../sections/filterable/filterable-component";
import DisplayTableComponent from "../../sections/display-table/display-table-component";
import InitialDataFetching from "../../utility-functions/initial-data-fetching";

const Dashboard = () => {
	const { 
	appointments, 
	emergencyRequests, 
	bloodStock, 
	helpRequests,  // Add this
	loading 
	} = useDatabase();
	const [data, setData] = useState([]);
	const [filter, setFilter] = useState("");
	const [selectedOpt, setSelectedOpt] = useState("name");

	useEffect(() => {
		InitialDataFetching({ source: "dashboard", setData });
	}, []);

	// useEffect(() => {
	// 	axios
	// 		.get("http://localhost:3001/api/dashboard")
	// 		.then((response) => {
	// 			setData(response.data);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// }, []);

	const handleSearchChange = (e) => {
		setFilter(e.target.value);
	};

	const handleInputChange = (e) => {
		setSelectedOpt(e.target.value);
	};

	const cardData = [
		{
			key: 111,
			statSubtitle: "DONATE BLOOD",
			statTitle: appointments?.length || "0",
			statArrow: "up",
			statPercent: "0",
			statIconName: <BiDonateBlood />,
			to: "/admin/donate-blood",
		},
		{
			key: 222,
			statSubtitle: "NEED BLOOD",
			statTitle: emergencyRequests?.length || "0",
			statArrow: "down",
			statPercent: "0",
			statIconName: <MdOutlineBloodtype />,
			to: "/admin/need-blood",
		},
		{
			key: 333,
			statSubtitle: "BLOOD STOCK",
			statTitle: bloodStock?.length || "0",
			statArrow: "up",
			statPercent: "0",
			statIconName: <MdOutlineVolunteerActivism />,
			to: "/admin/blood-stock",
		},
		// In cardData array
		{
		key: 444,
		statSubtitle: "NEED HELP",
		statTitle: helpRequests?.length || "0",  // Update this line
		statArrow: "down",
		statPercent: "0",
		statIconName: <BiHelpCircle />,
		to: "/admin/need-help",
		}
	];

	const filterData = (search) => {
		return data.filter((item) => {
			let matches = true;

			if (selectedOpt === "all") {
				return true;
			} else if (
				selectedOpt === "appointmentDate" ||
				selectedOpt === "appointmentTime" ||
				selectedOpt === "name" ||
				selectedOpt === "email" ||
				selectedOpt === "phone" ||
				selectedOpt === "source"
			) {
				matches = item[selectedOpt]?.toString().toLowerCase().includes(search.toLowerCase());
			} else {
				matches = false;
			}
			return matches;
		});
	};

	const handleCheckedChange = (id) => {
		const item = data.find((item) => item.id === id);
		let status = !item.checked;

		axios
			.put(`http://localhost:3001/api/new-users/checked`, {
				status,
				id,
			})
			.then((response) => {
				setData(
					data.map((item) =>
						item.id === id ? { ...item, checked: status } : item
					)
				);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleDelete = (id) => {
		axios
			.delete(`http://localhost:3001/api/dashboard/delete/${id}`)
			.then((response) => {
				setData(data.filter((item) => item.id !== id));
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const optionsData = [
		{ id: 1, name: "All", value: "all" },
		{ id: 2, name: "Name", value: "name" },
		{ id: 3, name: "Phone", value: "phone" },
		{ id: 4, name: "Email", value: "email" },
		{ id: 5, name: "Source", value: "source" },
		{ id: 6, name: "Date", value: "appointmentDate" },
		{ id: 7, name: "Time", value: "appointmentTime" }
	];

	const tableHeader = ["Name", "Email", "Phone", "Date", "Time", "Source", "Actions"];

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
			</div>
		);
	}

	return (
		<>
			<HeaderStats />
			<div className="bg-white p-10 m-10 -mt-20 rounded-rsm">
				<div className="flex flex-wrap">
					{cardData.map((item, index) => (
						<Link
							to={item.to}
							className="w-full lg:w-6/12 xl:w-3/12 px-4"
							key={item.key}
						>
							<CardStats
								key={item.key}
								statSubtitle={item.statSubtitle}
								statTitle={item.statTitle}
								statArrow={item.statArrow}
								statPercent={item.statPercent}
								statIconName={item.statIconName}
								statIconColor="bg-dark_red"
							/>
						</Link>
					))}
				</div>
				{/* <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
					<CardLineChart />
				</div> */}

				<h2 className="text-dark_red font-semibold mt-10 mb-5 text-[35px]">
					New User Submissions
				</h2>

				<FilterableComponent
					filter={filter}
					handleSearchChange={handleSearchChange}
					optionsData={optionsData}
					selectedOpt={selectedOpt}
					handleInputChange={handleInputChange}
				/>

				<div className="overflow-x-scroll">
					<DisplayTableComponent
						tableHeader={tableHeader}
						filterData={filterData}
						filter={filter}
						type={"new-users"}
						handleDelete={handleDelete}
						handleCheckboxChange={handleCheckedChange}
						editing={false}
					/>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
