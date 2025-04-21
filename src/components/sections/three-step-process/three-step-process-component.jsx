import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import ProcessStepComponent from "../process-step/process-step-component";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const ThreeStepProcessComponent = ( { stepDetails, stepsText } ) => {
	return (
		<WrapperSection>
			<div className="wrapper">
				<GroupedHeadingComponent
					subheadingText={stepsText.subheadingText}
					headingText={stepsText.headingText}
				/>
				<div className="process-steps-wrapper mt-5 sm:mt-10 grid md:grid-cols-[1fr_1fr_1fr]">
					{stepDetails.map((stepDetail) => {
						const { key, ...otherProps } = stepDetail;
						return <ProcessStepComponent key={key} {...otherProps} />;
					})}
				</div>
			</div>
		</WrapperSection>
	);
};

export default ThreeStepProcessComponent;
