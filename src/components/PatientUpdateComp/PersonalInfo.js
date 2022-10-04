import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import emrr from "../assets/images/emr.PNG";

const PersonalInfo = (props) => {
  const { step, setStep, patient, setPatient } = props;

  // console.log(patient);
  // const [hi, sethi] = useState(patient.dob);

  // console.log("http://localhost:8000/uploads/avatar/" + patient.patientAvatar);

  const [patientAvatarPreview, setpatientAvatarPreview] = useState(Object.keys(patient).length === 0 ? "" : patient.patientAvatar.length !== 0 ? `http://localhost:8000/uploads/avatar/${patient.patientAvatar}` : "");

  const fileOpener = (e) => {
    e.preventDefault();
    document.querySelector(".patient-avatar-input").click();
  };

  useEffect(() => {
    setpatientAvatarPreview(Object.keys(patient).length === 0 ? "" : patient.patientAvatar.length !== 0 ? `http://localhost:8000/uploads/avatar/${patient.patientAvatar}` : "");
  }, [patient.patientAvatar]);

  // const [reload, setReload] = useState(false);

  // useEffect(() => {
  //   document.getElementById("date").value = patient.dob;
  //   console.log(patient.dob);
  // }, [patient.dob]);

  const patientAvatarUploader = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      if (reader.readyState == 2) {
        setpatientAvatarPreview(reader.result);
      }
    };
  };

  const all_gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const martial_status = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
  ];

  const initialValues = {
    patientAvatar: Object.keys(patient).length === 0 ? "" : patient.patientAvatar,
    age: Object.keys(patient).length === 0 ? "" : patient.age,
    dob: Object.keys(patient).length === 0 ? "" : `${new Date(patient.dob).getUTCFullYear()}-${new Date(patient.dob).getUTCMonth() + 1}-${new Date(patient.dob).getUTCDate()}`,
    gender: Object.keys(patient).length === 0 ? "" : patient.gender,
    martialStatus: Object.keys(patient).length === 0 ? "" : patient.martialStatus,
    weight: Object.keys(patient).length === 0 ? "" : patient.weight,
    height: Object.keys(patient).length === 0 ? "" : patient.height,
    fatherName: Object.keys(patient).length === 0 ? "" : patient.fatherName,
  };

  const validationSchema = Yup.object({
    patientAvatar: Yup.mixed(),
    age: Yup.string(),
    dob: Yup.string(),
    gender: Yup.string(),
    martialStatus: Yup.string(),
    weight: Yup.string(),
    height: Yup.string(),
    fatherName: Yup.string(),
  });

  const onSubmit = async (values) => {
    // console.log(values.dob);
    // console.log(values);
    setPatient({ ...patient, ...values });
    setStep(2);
  };

  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ setFieldValue, handleChange, handleBlur, values }) => (
          <Form>
            {/* {console.log(values.dob)} */}
            <div className="mb-3">
              <div className="pateint-avater-wrapper mb-3">
                <img src={patientAvatarPreview.length !== 0 ? patientAvatarPreview : emrr} alt="" />
              </div>
              <input
                type="file"
                name="patientAvatar"
                accept="image/*"
                hidden
                className="patient-avatar-input"
                onChange={(e) => {
                  setFieldValue("patientAvatar", e.target.files[0]);
                  patientAvatarUploader(e);
                }}
              />
              <button type="button" className="btn btn-primary" onClick={(e) => fileOpener(e)}>
                Upload Picture
              </button>
            </div>

            <div className="mb-3">
              <label>Age</label>
              <Field type="text" className="form-control" name="age" />
            </div>

            <div className="mb-3">
              <label>Date of Birth</label>
              <Field type="date" className="form-control" name="dob" />
            </div>

            <div className="mb-3">
              <label>Gender</label>
              <Select
                isSearchable={false}
                options={all_gender}
                name="gender"
                value={{ label: `${values.gender}`, value: `${values.gender}` }}
                onChange={(e) => {
                  handleChange("gender", e);
                  setFieldValue("gender", e.value);
                }}
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-3">
              <label>Martial Status</label>
              <Select
                isSearchable={false}
                options={martial_status}
                name="martialStatus"
                value={{ label: `${values.martialStatus}`, value: `${values.martialStatus}` }}
                onChange={(e) => {
                  handleChange("martialStatus", e);
                  setFieldValue("martialStatus", e.value);
                }}
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-3">
              <label>Weight</label>
              <Field type="text" className="form-control" name="weight" />
            </div>

            <div className="mb-3">
              <label>Height</label>
              <Field type="text" className="form-control" name="height" />
            </div>

            <div className="mb-3">
              <label>Father Name</label>
              <Field type="text" className="form-control" name="fatherName" />
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PersonalInfo;
