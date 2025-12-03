import Home from "./Home"
import Login from "./Login"
import Register from "./Register"
import Simple from "./Simple"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Room from "./Room"
import UsersList from "./utilities/UsersList"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/teste" element={<Simple />} />
				<Route path="/register" element={<Register />} />
				<Route path="/room" element={<Room />} />
				<Route path="/test" element={<UsersList room="1"/>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
