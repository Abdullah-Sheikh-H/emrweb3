import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const BusinessEmailVerify = (props) => {
  const { setStep, hospitalFormData, sethospitalFormData } = props;

  const initialValues = {
    code: "",
  };

  const validationSchema = Yup.object({
    code: Yup.string().required("Code Required"),
  });

  const onSubmit = async (values) => {
    // console.log(values);
    setStep(6);
  };

  return (
    <div className="business-email-verify">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <div className="mb-3">
            <label className="form-label">Enter Code</label>
            <Field type="text" className="form-control" name="code" />
            <ErrorMessage name="code" component="span" className="error-text" />
          </div>

          <div className="d-flex">
            <button type="button" className="btn btn-primary me-2" onClick={() => setStep(4)}>
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

export default BusinessEmailVerify;
