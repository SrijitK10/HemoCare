import { useState } from "react";
import emailjs from "@emailjs/browser";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import FormComponent from "../../sections/form/form-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";

// Environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const HostBloodDrivePage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        institute: "",
        designation: "",
        city: "",
        message: "",
        dateTime: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending email...");
    
        try {
            // Ensure dateTime is formatted properly
            let formattedDateTime = "Not provided";
            if (formData.dateTime) {
                const dateObj = new Date(formData.dateTime);
                formattedDateTime = dateObj.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }).replace(/\//g, "-"); // Convert to DD-MM-YYYY format
    
                const formattedTime = dateObj.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // Use 24-hour format
                });
    
                formattedDateTime = `${formattedDateTime} ${formattedTime}`; // Combine Date and Time
            }
    
            // Prepare email parameters
            const emailParams = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                institute: formData.institute,
                designation: formData.designation || "N/A",
                city: formData.city,
                message: formData.message || "No message provided",
                dateTime: formattedDateTime, // Use formatted date-time
            };
    
            // Send email using EmailJS
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, PUBLIC_KEY);
            console.log("Email sent successfully!");
    
            // Insert user into another database if needed
            newUsersInsertRequest(formData, "host-blood-drive");
    
            // Reset form fields
            setFormData({
                name: "",
                email: "",
                phone: "",
                institute: "",
                designation: "",
                city: "",
                message: "",
                dateTime: "",
            });
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };
    const HostBloodDrivePageDetails = {
        quote: {
            classHint: "quote host-drive-quote",
            quoteText: "\u201cYour decision to host a blood drive with us can be the reason someone smiles today, tomorrow, and for many years to come. Let's make a difference together!\u201d",
        },
        benefits_host_drive: {
            subheadingText: "Being a Hero",
            headingText: "Benefits of Hosting a Blood Drive",
            classHint: "side-col-image benefits-host-drive",
            paraText: "Hosting a blood drive is a great way to give back to your community and help save lives. By providing a convenient location for people to donate, you can help ensure that there is a steady supply of blood for those in need.",
            imageUrl: "../../../assets/images/blood-donation(1).jpg",
            buttonText: "Host Now",
            buttonLink: "/host-blood-drive",
            buttonHave: true,
        },
        hosting_blood_drive: {
            subheadingText: "",
            headingText: "Hosting the Blood Drive",
            classHint: "side-col-image hosting-blood-drive",
            paraText: "On the day of the blood drive, it's important to ensure that everything runs smoothly and that donors have a positive experience.",
            imageUrl: "../../../assets/images/blood-donation(1).jpg",
            buttonText: "Host Now",
            buttonLink: "/host-blood-drive",
            buttonHave: true,
        },
        hero: {
            subheadingText: "Join us to save lives",
            headingText: "Host a Blood Drive to save lives with us",
            classHint: "host-blood-drive-page-hero",
        },
        stepsText: {
            subheadingText: "Guide for Hosting",
            headingText: "Promoting Your Blood Drive",
        },
    };

    const stepDetails = [
        { key: "promote-widely", stepNumber: "01", stepName: "Promote Widely", stepDescription: "Use social media, flyers, and emails to spread the word." },
        { key: "emphasize-benefits", stepNumber: "02", stepName: "Emphasize Benefits", stepDescription: "Highlight the positive impact donors can make." },
        { key: "variety-of-channels", stepNumber: "03", stepName: "Variety of Channels", stepDescription: "Use multiple marketing channels to reach potential donors." },
    ];

    return (
        <>
            <HeaderComponent />
            <HeroComponent {...HostBloodDrivePageDetails.hero} />
            <FormComponent
                fields={[
                    { key: "name", name: "name", type: "text", placeholder: "Name", required: true },
                    { key: "email", name: "email", type: "email", placeholder: "Email", required: true },
                    { key: "phone", name: "phone", type: "tel", placeholder: "Phone", required: true },
                    { key: "institute", name: "institute", type: "text", placeholder: "Institute", required: true },
                    { key: "designation", name: "designation", type: "text", placeholder: "Designation", required: false },
                    { key: "city", name: "city", type: "text", placeholder: "City", required: true },
                    { key: "dateTime", name: "dateTime", type: "datetime-local", placeholder: "Select Date & Time", required: true },
                ]}
                heading={"Host a Blood Drive"}
                buttonText={"Schedule Host"}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
            />
            <ThreeStepProcessComponent stepsText={HostBloodDrivePageDetails.stepsText} stepDetails={stepDetails} />
            <SideBySideComponent {...HostBloodDrivePageDetails.benefits_host_drive} />
            <QuoteComponent {...HostBloodDrivePageDetails.quote} />
            <SideBySideComponent {...HostBloodDrivePageDetails.hosting_blood_drive} />
            <BeforeFooterCTA />
            <FooterComponent />
        </>
    );
};

export default HostBloodDrivePage;