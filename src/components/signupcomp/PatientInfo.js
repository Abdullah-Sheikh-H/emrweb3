import React, { useEffect, useRef, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { ConnectButton } from "web3uikit"
import { useMoralis } from "react-moralis"
import Moralis from "moralis"
import VerifyHospital from "../contract-stuff/VerifyHospital"
import EncryptDecrypt from "../contract-stuff/EncryptDecrypt"
import Upload from "../contract-stuff/Upload"

const PatientInfo = (props) => {
	const { setStep, patientFormData, setpatientFormData } = props
	const {
		authenticate,
		isAuthenticated,
		isAuthenticating,
		user,
		account,
		isInitializing,
		isInitialized,
		isWeb3EnableLoading,
		logout,
		isWeb3Enabled,
	} = useMoralis()

	const [balance, setBalance] = useState(0)
	const [address, setAddress] = useState("")
	const [updatedAt, setUpdatedAt] = useState("")
	const [createdAt, setCreatedAt] = useState("")

	const getUserData = async () => {
		if (isAuthenticated && (user || account)) {
			console.log("hi")
			const add = await user.get("ethAddress")
			console.log(add)
			const bal = await Moralis.Web3API.account.getNativeBalance()
			setBalance(bal.balance)
			setAddress(add)

			const data = Moralis.Object.extend("_User")
			const query = new Moralis.Query(data)
			query.equalTo("ethAddress", address)
			const results = await query.find()
			if (results[0]) {
				setCreatedAt(results[0].createdAt.toString())
				setUpdatedAt(results[0].updatedAt.toString())
			}
		}
	}

	const connectHandler = async () => {
		await Moralis.authenticate({
			signingMessage: "Log in using Moralis",
		})
			.then(async () => {
				await Moralis.enableWeb3()
			})
			.catch(function (error) {
				console.log(error)
			})
		await getUserData()
	}

	const logOut = async () => {
		await logout()
		console.log("logged out")
	}

	useEffect(() => {
		getUserData()
	})

	const initialValues = {
		name: patientFormData.name,
		email: patientFormData.email,
	}

	const validationSchema = Yup.object({
		name: Yup.string().required("Name Required"),
		email: Yup.string().email("Invalid Email").required("Email Required"),
	})

	const onSubmit = async (values) => {
		// console.log(values);
		setpatientFormData({
			...patientFormData,
			name: values.name,
			email: values.email,
		})
		setStep(2)
	}

	return (
		<div className="patient-info">
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
				enableReinitialize={true}
			>
				<Form>
					<div className="mb-3">
						<label className="form-label">Name</label>
						<Field type="text" className="form-control" name="name" />
						<ErrorMessage name="name" component="span" className="error-text" />
					</div>

					<div className="mb-3">
						<label className="form-label">Email</label>
						<Field type="text" className="form-control" name="email" />
						<ErrorMessage
							name="email"
							component="span"
							className="error-text"
						/>
					</div>

					<div className="d-flex">
						<button
							type="button"
							className="btn btn-primary me-2"
							onClick={() => setStep(0)}
						>
							Previous
						</button>
						<button type="submit" className="btn btn-primary">
							Next
						</button>
					</div>
				</Form>
			</Formik>
			<div className="">
				<button onClick={connectHandler} className="btn btn-primary">
					Connect Metamask
				</button>
				<p>ethAddress: {address}</p>
				<p>Balance: {balance}ETH</p>
				<p>Created at: {createdAt}</p>
				<p>Updated at: {updatedAt}</p>
			</div>
			<br />
			<br />
			<Upload />
		</div>
	)
}

export default PatientInfo
