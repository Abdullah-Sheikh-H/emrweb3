import { QrReader } from "react-qr-reader"
import QRCode from "qrcode"
import { useState } from "react"

const Qr = () => {
	const [png, setPng] = useState("")
	const [showScanner, setShowScanner] = useState(false)

	const qrHandler = async () => {
		const img = await QRCode.toDataURL(
			"https://emrchains.web3solution.co/verify"
		)
		setPng(img)
	}

	const QrScanFunc = () => {
		setShowScanner((state) => !state)
	}

	return (
		<>
			<img src={png} />
			<button onClick={qrHandler}>get qr</button>
			{showScanner ? (
				<QrReader
					// forwardRef={scanner}
					constraints={{ facingMode: "environment" }}
					facingMode="back"
					onResult={(result, error) => {
						if (!!result) {
							console.log(result.text)
							setShowScanner(false)

							// const a = navigator.mediaDevices.getUserMedia("video");
							// console.log(a);

							const video = document.getElementById("video")
							video.pause()
						}

						if (!!error) {
							console.log("error in scanning code")
							// video.pause();
						}
					}}
					// onScan={(data, abc) => {
					//   console.log(data);
					//   console.log(abc);
					// }}
					// scanDelay={500}
					containerStyle={{ paddingTop: 0 }}
					// style={{ width: "100px", paddingTop: 0 }}
					videoContainerStyle={{ paddingTop: 0 }}
					videoStyle={{ width: "250px", height: "250px", position: "static" }}
				/>
			) : (
				""
			)}

			<button type="button" className="btn btn-primary" onClick={QrScanFunc}>
				Scan QR code
			</button>
		</>
	)
}

export default Qr
