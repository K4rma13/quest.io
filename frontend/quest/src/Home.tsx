import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RoomCard from "./utilities/RoomCard";
import LogoutButton from "./utilities/LogoutButton";
import { userName } from "./utilities/sessionHandler";



function Home(){
	const [user, setUser] = useState(" ");
	const [rooms,setRooms] = useState([]);
	
	const refreshRooms = async () =>{
		axios.get("/api/rooms").then((res)=>{
			setRooms(res.data)
		})
		.then(err =>{
			console.log(err)
		})
	}

	useEffect(()=>{
		userName().then(setUser)
		refreshRooms()
	},[])

	const cards = []
	for(let i = 0; i< rooms.length ; i++){
		cards.push(<RoomCard key={i}>{rooms[i]}</RoomCard>)
	}

	return(
		<div>
			{user == "" ? <Navigate to="/login" replace /> : <></>}
			<div className="d-flex justify-content-between">
				<h1>Welcome, {user}</h1>
				<LogoutButton />
			</div>
			<h1>Rooms</h1>
			<button className="btn btn-secondary" onClick={refreshRooms}><i className="bi bi-arrow-clockwise fs-5 text-dark"></i></button>
			<div className="d-flex flex-row flex-wrap justify-content-start p-4 mb-3">
				{cards}
			</div>
		</div>
	)

}

export default Home;