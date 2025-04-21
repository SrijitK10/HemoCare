import { useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import FormComponent from "../../sections/form/form-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

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
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            // Store in blood_drive_requests collection
            await addDoc(collection(db, "blood_drive_requests"), dataWithTimestamp);
            
            setSuccess(true);
            setError(""); // Clear error if successful
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
        } catch (err) {
            setError("Failed to submit request. Please try again.");
            console.error("Firestore Error: ", err);
        } finally {
            setLoading(false);
        }
    };

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
            placeholder: "Email",
            required: true,
        },
        {
            key: "phone",
            name: "phone",
            type: "tel",
            placeholder: "Phone",
            required: true,
        },
        {
            key: "institute",
            name: "institute",
            type: "text",
            placeholder: "Institute/Organization",
            required: true,
        },
        {
            key: "designation",
            name: "designation",
            type: "text",
            placeholder: "Designation",
            required: true,
        },
        {
            key: "city",
            name: "city",
            type: "text",
            placeholder: "City",
            required: true,
        },
        {
            key: "dateTime",
            name: "dateTime",
            type: "datetime-local",
            placeholder: "Preferred Date and Time",
            required: true,
        },
        {
            key: "message",
            name: "message",
            type: "textarea",
            placeholder: "Additional Message",
            required: false,
        }
    ];

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
            <HeroComponent 
                subheadingText="Host a Blood Drive"
                headingText="Organize a blood donation camp with us"
                classHint="hero host-blood-drive-hero"
            />
            <FormComponent
                fields={fields}
                heading="Request to Host a Blood Drive"
                buttonText={loading ? "Submitting..." : "Submit Request"}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
            />
            {success && <p className="text-green-600 text-center">Request submitted successfully!</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
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