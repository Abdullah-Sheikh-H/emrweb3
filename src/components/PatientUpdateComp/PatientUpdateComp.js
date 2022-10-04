import React, { useState, useEffect } from "react";
import "./PatientUpdateComp.css";
import { useParams } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import ContactInfo from "./ContactInfo";
const axios = require("axios");

const PatientUpdateComp = () => {
  const { id } = useParams();

  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({});
  //   console.log(patient);

  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/patient/${id}`, config);
        if (res.data.success) {
          //   console.log(res.data.patient);
          setPatient(res.data.patient);
        }
      } catch (error) {
        console.log("error in getting api response");
      }
    };

    fetchData();
  }, []);

  const renderSwitch = () => {
    switch (step) {
      case 1:
        return <PersonalInfo step={step} setStep={setStep} patient={patient} setPatient={setPatient} />;
      case 2:
        return <ContactInfo patient={patient} />;
    }
  };

  return <div>{renderSwitch()}</div>;
};

export default PatientUpdateComp;
