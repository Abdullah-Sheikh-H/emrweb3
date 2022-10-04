import { useEffect, useState } from "react"
import { useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis"
import abi from "../../constants/contractAbi.json"
import address from "../../constants/contractAddress.json"
import Moralis from "moralis"
import Web3 from "web3"
import { useMoralis } from "react-moralis"

const VerifyHospital = () => {
	const contractProcessor = useWeb3ExecuteFunction()
	const web3 = new Web3(Web3.givenProvider)
	const [patient, setPatient] = useState("")
	const [sig, setSig] = useState("")
	const [signature, setSignature] = useState("")
	const [tokenUri, setTokenUri] = useState("")
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
	const [currentAddress, setCurrentAddress] = useState("")
	const { runContractFunction } = useWeb3Contract()

	useEffect(() => {
		const func = async () => {
			if (isAuthenticated && (user || account)) {
				const add = await user.get("ethAddress")
				setCurrentAddress(add)
			}
		}
		func()
	}, [])

	const signHandler = async () => {
		// ------------------------------------------

		let nonarg = {
			contractAddress: address,
			functionName: "getRelayNonce",
			abi: abi,
			params: {
				nonceOf: currentAddress,
			},
		}

		const nonce = await contractProcessor.fetch({
			params: nonarg,
			onSuccess: () => {},
			onError: (error) => {
				alert(error)
			},
		})
		console.log(Number(nonce))

		//getting msg hash
		let msgarg = {
			contractAddress: address,
			functionName: "metaTransferHash",
			abi: abi,
			params: {
				to: currentAddress,
				value: web3.utils.toTwosComplement(10000),
				nonce: web3.utils.toTwosComplement(nonce),
			},
		}

		const msg = await contractProcessor.fetch({
			params: msgarg,
			onSuccess: () => {},
			onError: (error) => {
				alert(error)
			},
		})
		console.log("msg", msg)
		//-------------------------------------------------------

		// signing
		let sig = await web3.eth.personal.sign("" + msg, currentAddress)
		console.log("sig", sig)

		setSignature(sig)
	}

	const getVerified = async (e) => {
		e.preventDefault()

		console.log(patient)
		console.log(signature)

		let nonarg = {
			contractAddress: address,
			functionName: "getRelayNonce",
			abi: abi,
			params: {
				nonceOf: currentAddress,
			},
		}

		const nonce = await contractProcessor.fetch({
			params: nonarg,
			onSuccess: () => {},
			onError: (error) => {
				alert(error)
			},
		})
		console.log(Number(nonce))

		//main function and checking
		let approve = {
			contractAddress: address,
			functionName: "metaTransfer",
			abi: abi,
			params: {
				signature: signature,
				to: patient,
				value: web3.utils.toTwosComplement(10000),
				nonce: web3.utils.toTwosComplement(nonce),
				_tokenURI: tokenUri,
			},
		}

		const fetch = await contractProcessor.fetch({
			params: approve,
			onSuccess: () => {},
			onError: (error) => {
				alert(error.data)
				console.log(error)
			},
		})

		console.log("bool", fetch)
	}

	return (
		<>
			<form className="flex m-auto" onSubmit={getVerified}>
				<div className=" mt-3 mb-3">
					<label className="w-11/12 flex m-auto" htmlFor="patient">
						Patient Address:
					</label>
					<input
						onChange={(e) => setPatient(e.target.value)}
						className="border-1 w-11/12 flex m-auto p-2 h-8 rounded"
						type="text"
						id="patient"
						name="name"
					/>
				</div>
				<div>
					<label className="w-11/12 flex m-auto" htmlFor="signature">
						Patient Signature:
					</label>
					<input
						onChange={(e) => setSignature(e.target.value)}
						className="border-1 w-11/12 flex m-auto p-2 h-8 rounded"
						type="text"
						id="signature"
						name="name"
					/>
				</div>
				<div>
					<label className="w-11/12 flex m-auto" htmlFor="uri">
						URI:
					</label>
					<input
						onChange={(e) => setTokenUri(e.target.value)}
						className="border-1 w-11/12 flex m-auto p-2 h-8 rounded"
						type="text"
						id="uri"
						name="name"
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
			<button onClick={signHandler}>sign</button>
		</>
	)
}

export default VerifyHospital
