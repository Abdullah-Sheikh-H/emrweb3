// // const __message__ = "abc"

// if (!window.ethereum) return alert("Please Install Metamask")

// // connect and get metamask account
// const accounts = await window.ethereum.request({
// 	method: "eth_requestAccounts",
// })

// // message to sign
// const message = "hello"
// console.log({ message })

// // hash message
// const hashedMessage = Web3.utils.sha3(message)
// console.log({ hashedMessage })

// // sign hashed message
// const signature = await window.ethereum.request({
// 	method: "personal_sign",
// 	params: [hashedMessage, accounts[0]],
// })
// console.log({ signature })

// // split signature
// const r = signature.slice(0, 66)
// const s = "0x" + signature.slice(66, 130)
// const v = parseInt(signature.slice(130, 132), 16)
// console.log({ r, s, v })

// const __signature__ = await web3.eth
// 	.requestAccounts()
// 	.then((accounts) => web3.eth.personal.sign(__message__, accounts[0]))
// console.log(__signature__)

// const ethUtil = require("ethereumjs-util")
// const sig = ethUtil.fromRpcSig(ethUtil.addHexPrefix(__signature__))
// const msg = ethUtil.hashPersonalMessage(Buffer.from(__message__))
// const s = web3.utils.asciiToHex(sig.s.toString())
// const r = web3.utils.asciiToHex(sig.r.toString())
// const v = sig.v.toString()
// const Msg = web3.utils.asciiToHex(msg.toString())
// console.log(s, r, v, Msg)

// console.log(sig.v.toString(), sig.r.toString(), sig.s.toString())
// console.log(sig.toString())
// console.log(msg.toString())

// const publicKey = ethUtil.ecrecover(msg, sig.v, sig.r, sig.s)
// const pubAddress = ethUtil.pubToAddress(publicKey)
// const address = ethUtil.addHexPrefix(pubAddress.toString("hex"))

// const method = "metaTransfer"
// console.log(address)

// let approve = {
// 	contractAddress: address,
// 	functionName: "VerifyMessage",
// 	abi: abi,
// 	params: { _hashedMessage: hashedMessage, _v: v, _s: s, _r: r },
// }

// const nonce = await contractProcessor.fetch({
// 	params: approve,
// 	onSuccess: () => {},
// 	onError: (error) => {
// 		alert(error)
// 	},
// })
// console.log(nonce)

// console.log(nonce.toString())

// const nonce = await contracts.MetaCoin.replayNonce(
// 	this.state.account
// ).call()

// const args = [
// 	"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
// 	web3.utils.toTwosComplement(10000),
// 	web3.utils.toTwosComplement(0),
// ]

// const message = await contracts.MetaCoin[method + "Hash"](...args).call()
// console.log("message:", message)
// console.log(get)

// const publicKey = ethUtil.ecrecover(msg, sig.v, sig.r, sig.s)
// const pubAddress = ethUtil.pubToAddress(publicKey)
// const address = ethUtil.addHexPrefix(pubAddress.toString("hex"))
// console.log(address)

// let approve = {
// 	contractAddress: address,
// 	functionName: "approveHospital",
// 	abi: abi,
// 	params: {
// 		hospital: hospital,
// 	},
// }

// await contractProcessor.fetch({
// 	params: approve,
// 	onSuccess: () => {},
// 	onError: (error) => {
// 		alert(error)
// 	},
// })
