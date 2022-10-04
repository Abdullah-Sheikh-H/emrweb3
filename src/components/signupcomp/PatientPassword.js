import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const axios = require("axios");

const PatientPassword = (props) => {
  const { setStep, patientFormData, setpatientFormData } = props;

  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string().min(8, "Must be atleast 8 characters").required("Password Required"),
    confirmPassword: Yup.string()
      .required("Confirm Password Required")
      .oneOf([Yup.ref("password"), null], "Password Must Match"),
  });

  const onSubmit = async (values) => {
    // console.log(values);
    const userData = { ...patientFormData, password: values.password };
    // console.log(userData);
    const res = await axios.post("/patient/new", userData, config);
    if (res.data.success) {
      alert("patient registered");
    } else {
      alert("error in patient registeration");
    }
  };

  return (
    <div className="patient-password">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <Field type="password" className="form-control" name="password" />
            <ErrorMessage name="password" component="span" className="error-text" />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <Field type="password" className="form-control" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="span" className="error-text" />
          </div>

          <div className="d-flex">
            <button type="button" className="btn btn-primary me-2" onClick={() => setStep(2)}>
              Previous
            </button>
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default PatientPassword;
