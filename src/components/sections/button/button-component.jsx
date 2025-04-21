import { NavLink } from "react-router-dom";

const ButtonComponent = ({ buttonText, buttonLink, buttonType }) => {
	// For external links that start with http, we'll use an <a> tag
	// For internal navigation, we'll use NavLink
	const isExternalLink = buttonLink?.startsWith('http') || buttonLink?.startsWith('tel:');
	
	const buttonClass = `cta-btn 
		mt-5 rounded-rsm border 
		${
			buttonType === "fill"
				? "border-dark_red text-white bg-dark_red hover:bg-dark hover:text-white"
				: "border-off_white/[.5] text-dark bg-white hover:bg-red hover:text-white hover:border-red"
		}
		transition text-black px-8 py-3 text-sm w-fit font-bold`;
	
	// Return either a NavLink (for internal routing) or a regular anchor for external links
	if (isExternalLink) {
		return (
			<a 
				href={buttonLink} 
				className={buttonClass}
				target={buttonLink?.startsWith('http') ? "_blank" : "_self"}
				rel={buttonLink?.startsWith('http') ? "noopener noreferrer" : ""}
			>
				{buttonText}
			</a>
		);
	}
	
	// For internal links, use NavLink for proper routing
	return (
		<NavLink to={buttonLink} className={buttonClass}>
			{buttonText}
		</NavLink>
	);
};

export default ButtonComponent;
