import { encrypt } from "@metamask/eth-sig-util"
import { bufferToHex } from "ethereumjs-util"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import { Web3Storage } from "web3.storage"
import Web3 from "web3"
import abi from "../../constants/contractAbi.json"
import address from "../../constants/contractAddress.json"

const Upload = () => {
	const web3 = new Web3(Web3.givenProvider)
	const contractProcessor = useWeb3ExecuteFunction()
	const [name, setName] = useState("")
	const [disease, setDisease] = useState("")
	const [signature, setSignature] = useState("")
	const [key, setKey] = useState("")
	const [currentAddress, setCurrentAddress] = useState("")
	const [patient, setPatient] = useState("")
	const [URI, setURI] = useState("")

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

	useEffect(() => {
		const func = async () => {
			if (isAuthenticated && (user || account)) {
				const add = await user.get("ethAddress")
				setCurrentAddress(add)
			}
		}
		func()
	}, [])

	function makeFileObjects(_metaDataHash) {
		const obj = {
			metaData: _metaDataHash,
		}
		const blob = new Blob([JSON.stringify(obj)], { type: "application/json" })

		const files = [new File([blob], `${name}.json`)]
		return files
	}

	let Key

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
		console.log(nonce)

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

	const getEncryptionKey = async () => {
		const acc = currentAddress
		const keyB64 = await window.ethereum.request({
			method: "eth_getEncryptionPublicKey",
			params: [acc],
		})
		const publicKey = await Buffer.from(keyB64, "base64")
		setKey(publicKey.toString("base64"))
		Key = publicKey.toString("base64")
		console.log(Key)

		await signHandler()
	}

	async function encryptData() {
		// const acc = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
		// const keyB64 = await window.ethereum.request({
		// 	method: "eth_getEncryptionPublicKey",
		// 	params: [acc],
		// })
		// const publicKey = await Buffer.from(keyB64, "base64")
		// console.log(publicKey.toString("base64"))

		const encryptedData = bufferToHex(
			Buffer.from(
				JSON.stringify(
					encrypt({
						publicKey: key,
						data: JSON.stringify({ name: name, disease: disease }),
						version: "x25519-xsalsa20-poly1305",
					})
				),
				"utf8"
			)
		)
		return encryptedData
	}

	const getMetadataUri = async () => {
		const encryptedData = await encryptData()
		console.log(encryptedData)
		const metadata = makeFileObjects(encryptedData)

		const client = new Web3Storage({
			token:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhYTJlOTZGNzY4NEFhNjgzNTE0ZEMxYkNDOGI3NUY3YUZENGNCMUQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEyMzM1MjIxODAsIm5hbWUiOiJtZXRhZGF0YSJ9.oqONj-BglhHWGy6wKOP8zOEWJztKR98MJVXpCcZ8dLk",
		})

		const rootCid = await client.put(metadata, { name: name }) // Promise<CIDString>
		console.log(`ipfs://${rootCid}/${name}.json`)
		setURI(`ipfs://${rootCid}/${name}.json`)

		return `ipfs://${rootCid}/${name}.json`
	}

	const mintHandler = async (e) => {
		e.preventDefault()

		console.log(patient)
		console.log(signature)
		console.log(URI)

		let nonarg = {
			contractAddress: address,
			functionName: "getRelayNonce",
			abi: abi,
			params: {
				nonceOf: patient,
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

		//main function
		let approve = {
			contractAddress: address,
			functionName: "metaTransfer",
			abi: abi,
			params: {
				signature: signature,
				to: patient,
				value: web3.utils.toTwosComplement(10000),
				nonce: web3.utils.toTwosComplement(nonce),
				_tokenURI: URI,
			},
		}

		const res = await contractProcessor.fetch({
			params: approve,
			onSuccess: () => {},
			onError: (error) => {
				alert(error.data)
				console.log(error)
			},
		})
		console.log(res)
	}

	const submitHandler = async (e) => {
		e.preventDefault()
		const data = await getMetadataUri()

		console.log(data)
	}

	return (
		<>
			<form onSubmit={submitHandler}>
				<div>
					<label className=" flex ml-6" htmlFor="name">
						Name: &nbsp;
					</label>
					<input
						className=" rounded-full file:bg-slate-400 file:border-0 file:rounded-xl w-1/2 flex p-2"
						type="text"
						id="name"
						name="name"
						onChange={(e) => {
							setName(e.target.value)
						}}
					/>
				</div>

				<div>
					<label className=" flex ml-6" htmlFor="disease">
						Disease: &nbsp;
					</label>
					<input
						className=" rounded-full file:bg-slate-400 file:border-0 file:rounded-xl w-1/2 flex p-2"
						type="text"
						id="disease"
						name="name"
						onChange={(e) => {
							setDisease(e.target.value)
						}}
					/>
				</div>
				<button type="submit">Upload to ipfs</button>
			</form>
			<form onSubmit={() => mintHandler}>
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
				<button type="submit">Mint</button>
			</form>
			<button onClick={() => getEncryptionKey}>
				give permission to encrypt
			</button>
		</>
	)
}

export default Upload
