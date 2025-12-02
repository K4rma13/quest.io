import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import socket from "./socket";


function LogoutButton(){
    const [logged, setLogged] = useState(true);
    const logout = ()=>{
        socket.disconnect();
        axios.get("/api/logout")
        .then( ()=>setLogged(false))
    }
    return(
        <>
        {!logged ? <Navigate to="/login" replace /> : <></>}
        <button className="btn btn-secondary" onClick={logout}>Log out</button>
        </>
    )
}

export default LogoutButton;