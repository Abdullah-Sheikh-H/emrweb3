import React, { useEffect, useState } from "react"
import "./LoginComp.css"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useMoralis } from "react-moralis"
import Moralis from "moralis"
const LoginComp = () => {
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
		email: "",
		password: "",
	}

	const validationSchema = Yup.object({
		email: Yup.string().email("Invalid Email").required("Email Required"),
		password: Yup.string()
			.required("Password Required")
			.min(8, "Must be atleast 8 characters"),
	})

	const onSubmit = async (values) => {
		console.log(values)
	}

	return (
		<div className="login-comp-wrapper">
			<div className="container">
				<div className="row ms-0 me-0">
					<div className="col-md-6">text here</div>

					<div className="col-md-6">
						<h1 className="form-heading">
							Welcome Back, Please login to your account
						</h1>

						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							<Form>
								<div className="mb-3">
									<label className="form-label">Email address</label>
									<Field type="email" className="form-control" name="email" />
									<ErrorMessage
										name="email"
										component="span"
										className="error-text"
									/>
								</div>

								<div className="mb-3">
									<label className="form-label">Password</label>
									<Field
										type="password"
										className="form-control"
										name="password"
									/>
									<ErrorMessage
										name="password"
										component="span"
										className="error-text"
									/>
								</div>

								<button type="submit" className="btn btn-primary">
									Submit
								</button>
							</Form>
						</Formik>
					</div>
				</div>
			</div>
			<div className="">
				<button onClick={connectHandler} className="btn btn-primary">
					Connect Metamask
				</button>
				<p>ethAddress: {address}</p>
				<p>Balance: {balance}ETH</p>
				<p>Created at: {createdAt}</p>
				<p>Updated at: {updatedAt}</p>
			</div>
		</div>
	)
}

export default LoginComp
