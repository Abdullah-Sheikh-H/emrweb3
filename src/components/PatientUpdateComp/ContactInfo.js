import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const axios = require("axios");

const ContactInfo = (props) => {
  const { patient } = props;

  // console.log(patient);

  const config = {
    headers: {
      "content-type": "application/json",
      "content-type": "multipart/form-data",
    },
  };

  const initialValues = {
    cnic: Object.keys(patient).length === 0 ? "" : patient.cnic,
    email: Object.keys(patient).length === 0 ? "" : patient.email,
    phoneNumber: Object.keys(patient).length === 0 ? "" : patient.phoneNumber,
    address: Object.keys(patient).length === 0 ? "" : patient.address,
  };

  const validationSchema = Yup.object({
    cnic: Yup.string(),
    email: Yup.string().email(),
    phoneNumber: Yup.string(),
    address: Yup.string(),
  });

  const onSubmit = async (values) => {
    let reqData = { ...patient, ...values };
    delete reqData["dateOfJoining"];

    const res = await axios.post(`/patient/update/${patient._id}`, reqData, config);
    if (res.data.success) {
      console.log("patient updated");
    } else {
      console.log("error in updating patient");
    }
  };

  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        <Form>
          <div className="mb-3">
            <label>CNIC</label>
            <Field type="text" className="form-control" name="cnic" />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <Field type="text" className="form-control" name="email" />
          </div>

          <div className="mb-3">
            <label>Phone Number</label>
            <Field type="text" className="form-control" name="phoneNumber" />
          </div>

          <div className="mb-3">
            <label>Address</label>
            <Field type="text" className="form-control" name="address" />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ContactInfo;
