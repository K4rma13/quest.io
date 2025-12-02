import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function RegisterAttempt ({warning}:{warning: string}){
	if(warning){
		return( <p className="text-danger">{warning}</p>)
	}
}

function Register(){
	const [data, setData] = useState({
		user: "",
		passwd1: "",
		passwd2: "",
		email:""
	});

	const [warning,setWarning] = useState("");
	const [complete,setComplete] = useState(false);


	const handleSubmit = (event: { preventDefault: () => void; }) =>{
		event.preventDefault();
		console.log(data)
		if(data.passwd1 != data.passwd2){
			setWarning("Passwords dont match")
		}
		else if(data.passwd1.length < 8){
			setWarning("Your password should be at least 8 characters long")
		}
		else{
			axios.post("/api/register",data)
			.then(res => {
				switch(res.data) {
					case "Good": setComplete(true);
						break;
					case "email":
						setWarning("Email already in use");
						break;
					case "user":
						setWarning("Username already in use");
						break;
					default:
						setWarning("Something went wrong");
				}
			})
			.then(err => console.log(err));
		}
	}

	return(
	<div className="d-flex justify-content-center">
		{complete ? <Navigate to="/login" replace /> : <></>}
		<div className="flex-sm-column p-4">
			<div className="p-4"/>
			<div className="d-flex justify-content-center"><h1>Register</h1></div>
			<div className='p-2'/>
			<form onSubmit={handleSubmit}>
				<label className="form-label">Username</label>
				<input type="text" onChange={e => setData({...data, user: e.target.value})} className="form-control" id="username" aria-describedby="emailHelp"/>
				<div className="form-text">We'll never share your email with anyone else.</div>
				<div className='p-2'/>
				<label className="form-label">Email</label>
				<input type="email" onChange={e => setData({...data, email: e.target.value})} className="form-control" />
				<div className='p-2'/>
				<label className="form-label">Password</label>
				<input type="password" onChange={e => setData({...data, passwd1: e.target.value})} className="form-control" />
				<div className='p-2'/>
				<label className="form-label">Confirm Password</label>
				<input type="password" onChange={e => setData({...data, passwd2: e.target.value})} className="form-control" />
				<div className='p-2'/>
				<div className="d-flex justify-content-center">
					<button type="submit" className="btn btn-primary">Register</button>
				</div>
			</form>
			<RegisterAttempt warning={warning} />
		</div>
	</div>)
}

export default Register;