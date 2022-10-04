import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import PatientUpdate from "./pages/PatientUpdate"
import HospitalUpdate from "./pages/HospitalUpdate"
import VerifyQr from "./pages/VerifyQr"

function App() {
	console.log("hi")
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/signup" element={<SignUp />} />
					<Route exact path="/update/patient/:id" element={<PatientUpdate />} />
					<Route
						exact
						path="/update/hospital/:id"
						element={<HospitalUpdate />}
					/>
					<Route exact path="/verify" element={<VerifyQr />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
