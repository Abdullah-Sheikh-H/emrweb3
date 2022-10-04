import React from "react";

const SignUpOption = (props) => {
  const { setStep } = props;
  return (
    <div className="signup-options">
      <h1>Choose your account type</h1>
      <div className="d-flex align-items-center">
        <button className="btn btn-primary me-2" onClick={() => setStep(1)}>
          Patient
        </button>
        <button className="btn btn-primary" onClick={() => setStep(4)}>
          Hospital
        </button>
      </div>
    </div>
  );
};

export default SignUpOption;
