import { encrypt } from "@metamask/eth-sig-util"
import { bufferToHex } from "ethereumjs-util"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import { Web3Storage } from "web3.storage"
import Web3 from "web3"
import abi from "../constants/contractAbi.json"
import address from "../constants/contractAddress.json"
import Moralis from "moralis"

const VerifyQr = () => {
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
			if (!isWeb3Enabled && !isWeb3EnableLoading) {
				await Moralis.enableWeb3()
			}
			if (isAuthenticating) {
				console.log("hi")
				if (isAuthenticated && (user || account)) {
					const add = await user.get("ethAddress")
					setCurrentAddress(add)
					if (currentAddress != "") {
						await getEncryptionKey()
					} else {
						const add = await user.get("ethAddress")
						setCurrentAddress(add)

						await getEncryptionKey(add)
					}
				}
			} else {
				if (!isAuthenticated && !isAuthenticating) {
					await Moralis.authenticate()
					await Moralis.enableWeb3()
				}
				if (isAuthenticated && (user || account)) {
					const add = await user.get("ethAddress")
					setCurrentAddress(add)
					if (currentAddress != "") {
						await getEncryptionKey(add)
					} else {
						const add = await user.get("ethAddress")
						setCurrentAddress(add)
						await getEncryptionKey(add)
					}
				}
			}
		}
		if (isInitialized || isInitializing) {
			func()
		}
	}, [isAuthenticated, isWeb3Enabled])

	function makeFileObjects(_metaDataHash) {
		const obj = {
			metaData: _metaDataHash,
		}
		const blob = new Blob([JSON.stringify(obj)], { type: "application/json" })

		const files = [new File([blob], `${name}.json`)]
		return files
	}

	let Key

	const signHandler = async (userAddress) => {
		// ------------------------------------------

		let nonarg = {
			contractAddress: address,
			functionName: "getRelayNonce",
			abi: abi,
			params: {
				nonceOf: userAddress,
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
				to: userAddress,
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
		let sig = await web3.eth.personal.sign("" + msg, userAddress)
		console.log("sig", sig)

		setSignature(sig)
	}

	const getEncryptionKey = async (userAddress) => {
		const acc = userAddress
		const keyB64 = await window.ethereum.request({
			method: "eth_getEncryptionPublicKey",
			params: [acc],
		})
		const publicKey = await Buffer.from(keyB64, "base64")
		setKey(publicKey.toString("base64"))
		Key = publicKey.toString("base64")
		console.log(Key)

		await signHandler(userAddress)
	}

	return (
		<>
			<div>hello</div>
		</>
	)
}
export default VerifyQr
