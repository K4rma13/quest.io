import { Navigate, useNavigate } from "react-router-dom"
import Chat from "./utilities/Chat"
import { useEffect, useState } from "react"
import { isLogged } from "./utilities/sessionHandler"
import socket from "./utilities/socket"


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
        <div className="d-flex justify-content-between p-2">
            {!logged ? <Navigate to="/login" replace /> : <></>}
            <Chat />
            <button style={{width: "6rem",height: "3rem"}} className="btn btn-secondary p-1" onClick={goHome}>Leave</button>
        </div>
    )
}

export default Room