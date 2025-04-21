import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./form-component-styles.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const FormComponent = ({
	fields,
	heading,
	buttonText,
	formData,
	setFormData,
	handleSubmit,
}) => {
	const [status, setStatus] = useState("Pending");
	const [validationErrors, setValidationErrors] = useState({});

	// Style for input fields
	const inputStyles = `block w-full flex justify-start items-start rounded-rsm border-0 px-8 py-3 md:px-10 md:py-4 bg-light text-white ring-none placeholder:text-white outline-none focus:ring-1 focus:ring-center focus:bg-dark focus:ring-light sm:text-sm sm:leading-6`;
	const errorInputStyles = `${inputStyles} ring-1 ring-red-600`;

	// Restrict available times to between 09:00 and 17:45
	const filterTime = (time) => {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		return hours >= 9 && (hours < 17 || (hours === 17 && minutes <= 45));
	};

	// Prevent selecting past dates/times
	const filterDate = (date) => {
		const today = new Date();
		return date >= today;
	};

	// Handle form field change with validation
	const handleFieldChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		
		// Find the field definition to check if it has validation
		const fieldDef = fields.find(f => f.name === name);
		if (fieldDef && fieldDef.validate) {
			const error = fieldDef.validate(value);
			setValidationErrors(prev => ({
				...prev,
				[name]: error
			}));
		} else {
			// Clear any previous error if no validation function or no error
			if (validationErrors[name]) {
				const newErrors = { ...validationErrors };
				delete newErrors[name];
				setValidationErrors(newErrors);
			}
		}
	};

	// Validate all fields before submitting
	const validateForm = () => {
		const newErrors = {};
		let isValid = true;

		fields.forEach(field => {
			if (field.validate) {
				const error = field.validate(formData[field.name] || '');
				if (error) {
					newErrors[field.name] = error;
					isValid = false;
				}
			}
		});

		setValidationErrors(newErrors);
		return isValid;
	};

	// Handle form submission with validation
	const handleFormSubmit = (e) => {
		e.preventDefault();
		
		if (validateForm()) {
			handleSubmit(e);
			setStatus("Submitted");
		}
	};

	return (
		<WrapperSection>
			<div
				className="form-wrapper -mt-[10em] w-full relative p-6 py-10 lg:p-20 lg:pb-10 rounded-rmd z-[25] overflow-hidden"
			>
				<h3 className="not-italic text-center font-medium text-[16px] sm:text-[25px] leading-[34px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white">
					{heading}
				</h3>
				{status === "Submitted" ? (
					<p className="text-center text-white text-sm sm:text-base mt-5">
						Thank you for contacting HemoCare. We will get back to you as soon as possible.
					</p>
				) : (
					<form
						className="contact-form grid grid-cols-1 sm:grid-cols-2 gap-5 w-full relative sm:p-6 py-8 sm:p-10 rounded-rmd z-[25] overflow-hidden"
						onSubmit={handleFormSubmit}
					>
						{fields.map((field) =>
							field.type === "datetime-local" ? (
								<div key={field.key} className="grid sm:col-span-2 gap-5 w-full">
									<label className="text-white">{field.placeholder}</label>
									<DatePicker
										selected={formData.dateTime || null}
										onChange={(date) => setFormData({ ...formData, dateTime: date })}
										showTimeSelect
										timeFormat="HH:mm"
										timeIntervals={15}
										timeCaption="Time"
										dateFormat="dd-MM-yyyy HH:mm"
										minDate={new Date()} // Restrict past dates
										filterDate={filterDate} // Ensure only valid dates
										filterTime={filterTime} // Restrict time selection
										className={inputStyles}
										placeholderText={field.placeholder}
										required={field.required}
									/>
								</div>
							) : field.type === "select" ? (
								<div key={field.key} className="relative">
									<select
										onChange={handleFieldChange}
										value={formData[field.name] || ""}
										name={field.name}
										id={field.name}
										className={validationErrors[field.name] ? errorInputStyles : inputStyles}
										required={field.required}
									>
										{field.options?.map(option => (
											<option key={option.value} value={option.value}>{option.label}</option>
										))}
									</select>
									{validationErrors[field.name] && (
										<p className="text-red-500 text-xs mt-1 absolute bottom-[-20px]">
											{validationErrors[field.name]}
										</p>
									)}
								</div>
							) : (
								<div key={field.key} className="relative">
									<input
										onChange={handleFieldChange}
										value={formData[field.name] || ""}
										type={field.type}
										name={field.name}
										id={field.name}
										className={validationErrors[field.name] ? errorInputStyles : inputStyles}
										placeholder={field.placeholder}
										required={field.required}
									/>
									{validationErrors[field.name] && (
										<p className="text-red-500 text-xs mt-1 absolute bottom-[-20px]">
											{validationErrors[field.name]}
										</p>
									)}
								</div>
							)
						)}

						<div className="grid place-items-center sm:col-span-2 gap-5 mb-5 w-full">
							<button
								type="submit"
								name="submit"
								className="rounded-rsm border border-white hover:border-red text-dark bg-white hover:bg-red hover:text-white transition px-10 py-4 text-sm w-fit font-bold cursor-pointer"
							>
								{buttonText}
							</button>
						</div>
					</form>
				)}
			</div>
		</WrapperSection>
	);
};

export default FormComponent;