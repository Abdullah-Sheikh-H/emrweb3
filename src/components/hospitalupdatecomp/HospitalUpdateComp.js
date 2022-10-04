import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { configure } from "@testing-library/react";
const axios = require("axios");

const HospitalUpdateComp = () => {
  const { id } = useParams();

  //   console.log(id);

  const [hospital, setHospital] = useState({});

  //   console.log(hospital);

  const all_services = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

  const all_type = [
    { value: "Eye Hospital", label: "Eye Hospital" },
    { value: "Cardiology", label: "Cardiology" },
    { value: "Cancer Hospital", label: "Cancer Hospital" },
  ];

  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  const initialValues = {
    businessName: Object.keys(hospital).length === 0 ? "" : hospital.businessName,
    email: Object.keys(hospital).length === 0 ? "" : hospital.email,
    phoneNumber: Object.keys(hospital).length === 0 ? "" : hospital.phoneNumber,
    ownerShip: Object.keys(hospital).length === 0 ? "" : hospital.ownerShip,
    address: Object.keys(hospital).length === 0 ? "" : hospital.address,
    services: Object.keys(hospital).length === 0 ? [] : hospital.services,
    type: Object.keys(hospital).length === 0 ? "" : hospital.type,
  };

  const validationSchema = Yup.object({
    businessName: Yup.string(),
    email: Yup.string().email(),
    phoneNumber: Yup.string(),
    ownerShip: Yup.string(),
    address: Yup.string(),
    services: Yup.array(),
    type: Yup.string(),
  });

  const onSubmit = async (values) => {
    // console.log(values);
    const res = await axios.post(`/hospital/update/${id}`, values, config);
    if (res.data.success) {
      console.log("Hospital Updated");
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/hospital/${id}`, config);
      if (res.data.success) {
        setHospital(res.data.hospital);
      } else {
        console.log("Error in getting api response");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {({ setFieldValue, handleChange, handleBlur, values }) => (
          <Form>
            <div className="mb-3">
              <label>Business Name</label>
              <Field type="text" className="form-control" name="businessName" />
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
              <label>Owner Ship</label>
              <Field type="text" className="form-control" name="ownerShip" />
            </div>

            <div className="mb-3">
              <label>Address</label>
              <Field type="text" className="form-control" name="address" />
            </div>

            <div className="mb-3">
              <label>Services</label>
              <Select
                isSearchable={false}
                options={all_services}
                name="services"
                isMulti
                value={values.services.map((i) => {
                  return { value: `${i}`, label: `${i}` };
                })}
                onChange={(e) => {
                  const a = e.map((i) => i.value);
                  console.log(a);
                  handleChange("services", e);
                  setFieldValue("services", a);
                }}
                onBlur={handleBlur}
              />
            </div>

            <div className="mb-3">
              <label>Type</label>
              <Select
                isSearchable={false}
                options={all_type}
                name="type"
                value={{ label: `${values.type}`, value: `${values.type}` }}
                onChange={(e) => {
                  handleChange("type", e);
                  setFieldValue("type", e.value);
                }}
                onBlur={handleBlur}
              />
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default HospitalUpdateComp;
