import { ethers } from "ethers"
import { encrypt } from "@metamask/eth-sig-util"
import { bufferToHex } from "ethereumjs-util"
import Web3 from "web3"
import { useMoralis } from "react-moralis"
import { useState } from "react"

const EncryptDecrypt = () => {
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

	const convertBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.readAsDataURL(file)

			fileReader.onload = () => {
				resolve(fileReader.result)
			}

			fileReader.onerror = (error) => {
				reject(error)
			}
		})
	}

	const [bufdata, setBufdata] = useState()
	const [dataToDecrypt, setDataToDecrypt] = useState()
	const [fileImg, setFileImg] = useState()
	const [decryptedData, setDecryptedData] = useState()

	async function encryptData(e) {
		e.preventDefault()

		const acc = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
		const keyB64 = await window.ethereum.request({
			method: "eth_getEncryptionPublicKey",
			params: [acc],
		})
		const publicKey = await Buffer.from(keyB64, "base64")
		console.log(publicKey.toString("base64"))

		const encryptedPhoto = bufferToHex(
			Buffer.from(
				JSON.stringify(
					encrypt({
						publicKey: publicKey.toString("base64"),
						data: fileImg,
						version: "x25519-xsalsa20-poly1305",
					})
				),
				"utf8"
			)
		)
		setDataToDecrypt(encryptedPhoto)
		console.log(encryptedPhoto)
	}

	//DECRYPT:
	async function decryptData() {
		const web3 = new Web3(window.ethereum)
		const acc = web3.eth.accounts.privateKeyToAccount(
			"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" //Private Key
		).address

		let decryptedMessage = await window.ethereum
			.request({
				method: "eth_decrypt",
				params: [dataToDecrypt, account],
			})
			.catch((error) => window.alert(error.message))

		console.log(decryptedMessage)

		console.log()

		setDecryptedData(decryptedMessage)
	}

	// const [key, setKey] = useState()
	// const Random = async () => {
	// 	const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
	// 	const keyB64 = await window.ethereum.request({
	// 		method: "eth_getEncryptionPublicKey",
	// 		params: [account],
	// 	})
	// 	const publicKey = Buffer.from(keyB64, "base64")
	// 	console.log(publicKey)
	// 	setKey(publicKey)
	// }

	return (
		<>
			{/* <div>
				<button onClick={Random}>get</button>
				<p>{key}</p>
			</div> */}
			<div>
				<form onSubmit={encryptData}>
					<label className=" flex ml-6" htmlFor="metadatafile">
						Choose Audio File:
					</label>
					<input
						className=" rounded-full file:bg-slate-400 file:border-0 file:rounded-xl w-1/2 flex p-2"
						type="file"
						accept="image/*"
						id="metadatafile"
						name="Choose Audio File"
						onChange={async (e) => {
							console.log(e.target.files[0])
							const bas64 = await convertBase64(e.target.files[0])
							setFileImg(bas64)
						}}
					/>
					<button type="submit">get</button>
					<p>{dataToDecrypt}</p>
				</form>
			</div>
			<div>
				<button onClick={decryptData}>get decrypt</button>
				<img src={decryptedData} />
			</div>
		</>
	)
}
export default EncryptDecrypt
