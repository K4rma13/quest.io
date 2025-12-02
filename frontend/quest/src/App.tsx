import Home from "./Home"
import Login from "./Login"
import Register from "./Register"
import Simple from "./Simple"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Room from "./Room"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/teste" element={<Simple />} />
				<Route path="/register" element={<Register />} />
				<Route path="/room" element={<Room />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
