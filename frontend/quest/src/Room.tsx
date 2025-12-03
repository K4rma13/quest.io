import { Navigate, useNavigate } from "react-router-dom"
import Chat from "./utilities/Chat"
import { useEffect, useState } from "react"
import { isLogged } from "./utilities/sessionHandler"
import socket from "./utilities/socket"
import UsersList from "./utilities/UsersList"


function Room(){
	const navigate = useNavigate()
	const [logged,setLogged] = useState(true)

	useEffect(()=>{
			isLogged().then(setLogged)
	},[])

	const goHome = () =>{
		socket.disconnect()
		navigate("/")
	}
	return(
		<>
		<div className="d-flex justify-content-end">
		<button style={{width: "6rem",height: "3rem"}} className="btn btn-secondary p-1" onClick={goHome}>Leave</button>
		</div>
		<div className="d-flex flex-row flex-wrap justify-content-start p-4 mb-3">
			{!logged ? <Navigate to="/login" replace /> : <></>}
			<Chat />
			<UsersList />
		</div>
		</>
	)
}

export default Room