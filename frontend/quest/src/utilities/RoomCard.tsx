
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PasswdPopup from "./PasswdPopup"

export interface roominfo {
	label: string,
	descr: string,
	id: number,
	capacity: number,
	passwd: boolean,
	count: number,
	username: string
}

function RoomCard({children}:{children:roominfo}){
	const [joined,setJoined] = useState("home")
	const navigate = useNavigate();

	const joinRoom = (pass:string)=>{
		console.log(children.id)
		axios.post("/api/joinroom",{id:children.id,passwd:pass})
		.then(res=>{
			if(res.data=="room"){
				navigate("/room")
			}
			setJoined(res.data)
		})
	}
	const resetJoined = ()=>{
		setJoined("home")
	}
	const passHandler = async (a:string) => {
		joinRoom(a)
	}

	return(
	<div className="p-2">
		<PasswdPopup show={joined=="passwd"} toggle={resetJoined} passwd={passHandler}/>
		<div className="card" style={{width: "16rem"}}>
			<div className="card-body text-center">
				<h5 className="card-title">{children.label} {children.passwd ? <>🔒</> : <></>}</h5>
				<p className="card-text">{children.descr}</p>
				<div className="mb-0">
					<button className="btn btn-info" onClick={()=>joinRoom("")}>Join</button>
					<p className="card-text">{children.count}/{children.capacity} 🧑</p>
				</div>
			</div>
			<p className="card-text fw-light text-end mb-1 pe-2">Created by: {children.username}</p>
		</div>
	</div>
	)
}

export default RoomCard