import { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";

import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import SearchBloodStockComponent from "../../sections/search-blood-stock/search-blood-stock-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import MapComponent from "../../sections/map/MapComponent";
// import MapplsComponent from "../../sections/mappls-map/MapplsComponent";


const NeedBloodPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		bloodType: "",
		message: "",
		location: "",
		urgency: "normal" // Default to normal urgency
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);

		try {
			// Add timestamp to the form data
			const dataWithTimestamp = {
				...formData,
				timestamp: new Date().toISOString()
			};
			
			// FIXED: Updated Collection Name (Removed Space)
			await addDoc(collection(db, "emergency_blood_requests"), dataWithTimestamp);
			setSuccess(true);
			setError(""); // Clear error if successful
			setFormData({
				name: "",
				email: "",
				phone: "",
				bloodType: "",
				message: "",
				location: "",
				urgency: "normal"
			});
		} catch (err) {
			setError("Failed to submit request. Please try again.");
			console.error("Firestore Error: ", err);
		} finally {
			setLoading(false);
		}
	};

	const NeedBloodPageDetails = {
		quote: {
			classHint: "quote need-blood-quote",
			quoteText: `Facing a blood emergency?\n 
            Request a callback and let us help you!`,
			buttonText: "Call Now",
			buttonLink: "tel:+920304050607",
			buttonHave: true,
		},
		tips_for_managing_blood_loss: {
			subheadingText: "",
			headingText: "Tips for Managing Blood Loss",
			classHint: "tips-for-managing-blood-loss",
			paraText: [
				`Stay calm and avoid any strenuous activity.`,
				`Elevate the affected area if possible to reduce blood flow.`,
				`Apply pressure to the wound to slow down or stop the bleeding.`,
				`Drink fluids such as water or sports drinks to help replenish lost fluids.`,
				`Consume foods that are high in iron and protein, such as spinach, beans, and lean meats to help replenish lost nutrients.`,
				`Consider taking iron supplements if recommended by your doctor.`,
				`Keep a record of any symptoms and changes in condition to share with medical professionals.`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Need blood?",
			headingText: "Your blood needs are our priority.",
			classHint: "hero need-blood-page-hero",
		},
		stepsText: {
			subheadingText: "Collecting Blood",
			headingText: "From start to finish, here's what to expect.",
		},
		bloodStock: {
			subheadingText: "When you need it",
			headingText: "Find Available Blood Stock",
			classHint: "search-blood-stock",
		},
	};

	const stepDetails = [
		{
			key: "registration",
			stepNumber: "01",
			stepName: "Registration",
			stepDescription:
				"You will be asked to fill out a form with your personal information and medical history.",
		},
		{
			key: "screening",
			stepNumber: "02",
			stepName: "Screening",
			stepDescription:
				"A medical professional will check your vitals and ask you a series of questions to ensure you are eligible to donate.",
		},
		{
			key: "donation",
			stepNumber: "03",
			stepName: "Donation",
			stepDescription:
				"A sterile needle will be inserted into your arm to collect your blood, which will then be stored and used for transfusions.",
		},
	];

	const fields = [
		{
			key: "name",
			name: "name",
			type: "text",
			placeholder: "Name",
			required: true,
		},
		{
			key: "email",
			name: "email",
			type: "email",
			placeholder: "Email (required for notifications)",
			required: true,
			validate: (value) => {
				if (!value) return "Email is required for status notifications";
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) return "Please enter a valid email address";
				return null;
			}
		},
		{
			key: "phone",
			name: "phone",
			type: "tel",
			placeholder: "Phone",
			required: true,
		},
		{
			key: "bloodType",
			name: "bloodType",
			type: "text",
			placeholder: "Blood Type",
			required: false,
		},
		{
			key: "location",
			name: "location",
			type: "text",
			placeholder: "Location (City/Area)",
			required: true,
		},
		{
			key: "urgency",
			name: "urgency",
			type: "select",
			placeholder: "Urgency Level",
			required: true,
			options: [
				{ value: "normal", label: "Normal" },
				{ value: "urgent", label: "Urgent" },
				{ value: "emergency", label: "Emergency" }
			]
		}
	];

	return (
		<>
			<HeaderComponent />

			<HeroComponent {...NeedBloodPageDetails.hero} />
			<FormComponent
				fields={fields}
				heading={"Request for emergency blood"}
				buttonText={loading ? "Submitting..." : "Request blood"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
			/>
			{/* 🔥 Display success or error messages */}
			{success && <p className="text-green-600 text-center">Request submitted successfully!</p>}
			{error && <p className="text-red-600 text-center">{error}</p>}

			<QuoteComponent {...NeedBloodPageDetails.quote} />
			<SearchBloodStockComponent {...NeedBloodPageDetails.bloodStock} />
			<ThreeStepProcessComponent
				stepsText={NeedBloodPageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			
			<CriteriaComponent {...NeedBloodPageDetails.tips_for_managing_blood_loss} />
			<MapComponent />
			<BeforeFooterCTA />
			<FooterComponent />
			
			
		</>
	);
};

export default NeedBloodPage;
