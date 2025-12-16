import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface data{
	id:number,
	title: string
}

function CreateRoom(){

	const [rooms,setRooms] = useState<Array<data>>([])
	const [selRoom,setSelRoom] = useState("")
	const [capacity,setCapacity] = useState("")
	const [description,setDescription] = useState("")
	const [label,setLabel] = useState("")
	const [password,setPassword] = useState("")
	const navigate = useNavigate()
	
	useEffect(()=>{
		axios.get("/api/quests")
		.then(res=>{
			setRooms(res.data)
		})
	},[])

	const changeCapacity = (e:ChangeEvent<HTMLInputElement>)=> {
		if(Number(e.target.value)>15) e.target.value = "15"
		else if(Number(e.target.value)<2) e.target.value = "2"
		setCapacity(e.target.value)
	}

	const changeDescription = (e:ChangeEvent<HTMLTextAreaElement>)=> {
		if(e.target.value.length>200) e.target.value = e.target.value.slice(0,200-e.target.value.length)
		setDescription(e.target.value)
	}

	const changeLabel = (e:ChangeEvent<HTMLInputElement>)=> {
		setLabel(e.target.value)
	}

	const changePassword = (e:ChangeEvent<HTMLInputElement>)=> {
		setPassword(e.target.value)
	}

	const sendRoom = () =>{
		const data = {
			label: label,
			questid: selRoom,
			cap: capacity,
			passwd: password,
			descr: description
		}
		axios.post("/api/createroom",data)
		.then(res=>{
			if(res.data=="success") navigate("/")
			console.log(res.data)
		})
	}

	const showRooms = []

	for(let i=0; i< rooms.length; i++){
		showRooms.push(<option value={rooms[i].id}>{rooms[i].title}</option>)
	}
	console.log(selRoom)
	console.log(capacity)

	return(<div className="d-flex justify-content-center">
		<div className="flex-sm-column p-4">
			<div className="p-4"/>
			<div className="d-flex justify-content-center"><h1>Create Room</h1></div>
			<div className='p-2'/>
				<label className="label">Room Name</label>
				<input type="text" className="form-control mb-2" onChange={changeLabel}/>
				<label className="label">Questionnaire</label>
				<select className="form-select mb-2" aria-label=".form-select-lg example" onChange={(e)=>setSelRoom(e.target.value)}>
					<option selected disabled>Select Questionnaire</option>
					{showRooms}
				</select>
				<label className="label">Capacity</label>
				<label className="label ms-4">Password</label>
				<div className="d-flex flex-row">
					<input min="2" max="10" type="number" className="form-control" onChange={changeCapacity} style={{height:"2.4rem",width:"4.5rem",marginRight:"0.5rem"}}/>
					<input type="password" className="form-control mb-1" onChange={changePassword}/>
				</div>
				<div className="form-text mb-3">Leave an empty password for an open room.</div>
				<label className="label">Description</label>
				<textarea className="form-control mb-1" style={{height:"8rem"}} onChange={changeDescription}/>
				<div className="form-text mb-3">Max Characters: {description.length}/200</div>
				<div className="d-flex justify-content-center">
					<button className="btn btn-primary" onClick={sendRoom}>Create</button>
				</div>
		</div>
	</div>)
}

export default CreateRoom;