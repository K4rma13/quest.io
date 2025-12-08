import Home from "./Home"
import Login from "./Login"
import Register from "./Register"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Room from "./Room"
import Questionaire from "./Questionaire"
import CreateRoom from "./CreateRoom"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/room" element={<Room />} />
				<Route path="/quest" element={<Questionaire />} />
				<Route path="/createroom" element={<CreateRoom />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
