import React, { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useMoralis } from "react-moralis"
import Moralis from "moralis"
import Qr from "../contract-stuff/Qr"
const BusinessInfo = (props) => {
	const { setStep, hospitalFormData, sethospitalFormData } = props
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
		businessName: hospitalFormData.businessName,
		email: hospitalFormData.email,
	}

	const validationSchema = Yup.object({
		businessName: Yup.string().required("Business Name Required"),
		email: Yup.string().email("Invalid Email").required("Email Required"),
	})

	const onSubmit = async (values) => {
		// console.log(values);
		sethospitalFormData({
			...hospitalFormData,
			businessName: values.businessName,
			email: values.email,
		})
		setStep(5)
	}

	return (
		<div className="business-info">
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
				enableReinitialize={true}
			>
				<Form>
					<div className="mb-3">
						<label className="form-label">Business Name</label>
						<Field type="text" className="form-control" name="businessName" />
						<ErrorMessage
							name="businessName"
							component="span"
							className="error-text"
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">Email</label>
						<Field type="email" className="form-control" name="email" />
						<ErrorMessage
							name="email"
							component="span"
							className="error-text"
						/>
					</div>

					<div className="d-flex justify-content-center">
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
			<Qr />
		</div>
	)
}

export default BusinessInfo
