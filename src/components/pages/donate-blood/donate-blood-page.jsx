import { useState } from "react";
import emailjs from "@emailjs/browser";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

// Environment variables for EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_DONATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const DonateBloodPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bloodType: "",
        message: "",
        dateTime: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting donation request...");

        try {
            // Format the date-time properly
            let formattedDateTime = "Not provided";
            if (formData.dateTime) {
                const dateObj = new Date(formData.dateTime);
                formattedDateTime = dateObj.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // Use 24-hour format
                }).replace(",", "");
            }

            // Store the appointment in Firebase
            const docRef = await addDoc(collection(db, "appointments"), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bloodType: formData.bloodType,
                message: formData.message || "No message provided",
                dateTime: formattedDateTime,
                timestamp: new Date(),
            });

            console.log("Appointment added with ID: ", docRef.id);

            // Send confirmation email using EmailJS
            const emailParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bloodType: formData.bloodType,
                message: formData.message || "No message provided",
                dateTime: formattedDateTime,
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY);
            console.log("Email sent successfully!");

            // Reset form after successful submission
            setFormData({
                name: "",
                email: "",
                phone: "",
                bloodType: "",
                message: "",
                dateTime: "",
            });

        } catch (error) {
            console.error("Error submitting donation request: ", error);
        }
    };

    const fields = [
        { key: "name", name: "name", type: "text", placeholder: "Name", required: true },
        { key: "email", name: "email", type: "email", placeholder: "Email", required: true },
        { key: "phone", name: "phone", type: "text", placeholder: "Phone", required: true },
        { key: "bloodType", name: "bloodType", type: "text", placeholder: "Blood Type", required: true },
        { key: "dateTime", name: "dateTime", type: "datetime-local", placeholder: "Select Date & Time", required: true }
    ];

    return (
        <>
            <HeaderComponent />
            <HeroComponent subheadingText="Donate Blood" headingText="Save life by donating blood today" classHint="donate-blood-page-hero" />
            <FormComponent
                fields={fields}
                heading={"Schedule an Appointment"}
                buttonText={"Schedule an Appointment"}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
            />
            <ThreeStepProcessComponent stepsText={{ subheadingText: "Donation Process", headingText: "Step-by-Step Guide to Donating Blood" }} stepDetails={[]} />
            <CriteriaComponent subheadingText="Are you ready?" headingText="Eligibility Criteria" classHint="side-col-image eligibility-criteria" paraText={["18-50 years, above 50 Kg.", "Normal temperature, pulse and blood pressure.", "No Respiratory Diseases", "Above 12.5 g/dL Hemoglobin", "No skin disease, puncture or scars", "No history of transmissible disease"]} />
            <SideBySideComponent subheadingText="Donate blood today" headingText="Why should you donate blood?" classHint="side-col-image why-donate-blood" paraText={`Donating blood is a selfless act that has the power to save lives.`} />
            <QuoteComponent classHint="quote" quoteText={`“By donating money, you provide nourishment. By donating blood, you give the gift of life. Join us in this noble cause today!”`} />
            <BeforeFooterCTA />
            <FooterComponent />
        </>
    );
};

export default DonateBloodPage;