import "./two-cta-styles.scss";

import WrapperSection from "../wrapper-section/wrapper-section-component";
import ButtonComponent from "../button/button-component";
import { Link } from "react-router-dom";

const TwoCtaComponent = () => {
	const ctaDetails = [
		{
			key: "donate-blood",
			ctaClass: "first-cta-col",
			subheading: "Save a life today",
			heading: "Donate blood at HemoCare",
			btnText: "Donate blood",
			ctaLink: "/donate-blood",
		},
		{
			key: "request-blood",
			ctaClass: "second-cta-col",
			subheading: "Urgent need for blood",
			heading: "Request for blood donation",
			btnText: "Request blood",
			ctaLink: "/need-blood",
		},
	];

	return (
		<WrapperSection>
			<div className="cta-content-wrapper grid place-items-start sm:grid-cols-[1fr_1fr] gap-[20px] w-full">
				{ctaDetails.map((ctaDetail) => (
					<div
						key={ctaDetail.key}
						className={`cta-col sm:before:transition rounded-rmd overflow-hidden w-full relative z-[25] pt-[150px] pb-[30px] sm:pb-[50px] px-[30px] sm:px-[50px] ${ctaDetail.ctaClass}`}
					>
						<div className="cta-col-content relative z-50">
							<p className="cta-subheading not-italic font-medium text-sm sm:text-md leading-normal tracking-[0.2em] uppercase text-white">
								{ctaDetail.subheading}
							</p>
							<h2 className="cta-heading not-italic font-semibold text-[30px] sm:text-[40px] leading-tight capitalize text-white">
								{ctaDetail.heading}
							</h2>

							<ButtonComponent
								buttonText={ctaDetail.btnText}
								buttonLink={ctaDetail.ctaLink}
								buttonType={"line"}
							/>
						</div>
						
						{/* Add a full card overlay link for better UX */}
						<Link 
							to={ctaDetail.ctaLink} 
							className="absolute inset-0 z-10"
							aria-label={ctaDetail.heading}
						/>
					</div>
				))}
			</div>
		</WrapperSection>
	);
};

export default TwoCtaComponent;
