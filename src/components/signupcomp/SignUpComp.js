import React, { useState } from "react";
import "./SignUpComp.css";
import SignUpOption from "./SignUpOption";
import BusinessInfo from "./BusinessInfo";
import BusinessEmailVerify from "./BusinessEmailVerify";
import BusinessPassword from "./BusinessPassword";
import PatientInfo from "./PatientInfo";
import PatientEmailVerify from "./PatientEmailVerify";
import PatientPassword from "./PatientPassword";

const SignUpComp = () => {
  const [step, setStep] = useState(0);

  const [hospitalFormData, sethospitalFormData] = useState({ businessName: "", email: "", password: "" });

  const [patientFormData, setpatientFormData] = useState({ name: "", email: "", password: "" });

  const renderSwitch = () => {
    switch (step) {
      case 0:
        return <SignUpOption setStep={setStep} />;
      case 1:
        return <PatientInfo setStep={setStep} patientFormData={patientFormData} setpatientFormData={setpatientFormData} />;
      case 2:
        return <PatientEmailVerify setStep={setStep} patientFormData={patientFormData} setpatientFormData={setpatientFormData} />;
      case 3:
        return <PatientPassword setStep={setStep} patientFormData={patientFormData} setpatientFormData={setpatientFormData} />;
      case 4:
        return <BusinessInfo setStep={setStep} hospitalFormData={hospitalFormData} sethospitalFormData={sethospitalFormData} />;
      case 5:
        return <BusinessEmailVerify setStep={setStep} hospitalFormData={hospitalFormData} sethospitalFormData={sethospitalFormData} />;
      case 6:
        return <BusinessPassword setStep={setStep} hospitalFormData={hospitalFormData} sethospitalFormData={sethospitalFormData} />;
    }
  };

  return (
    <div className="signup-comp-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-6">some text here...</div>
          <div className="col-md-6">{renderSwitch()}</div>
        </div>
      </div>
    </div>
  );
};

export default SignUpComp;
