import { useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

function LogAttempt ({logged}:{logged:string}){
	if(logged == "Logged"){
		return( <>
					<p className="text-success">{logged}</p>
					<Navigate to="/" replace />
				</>
		)
	}
	return( <p className="text-danger">{logged}</p>)
}

function Login(){
	const [data, setData] = useState({
		user: "",
		passwd: ""
	})
	const [logged,setLogged] = useState("");

	const handleSubmit = (event: { preventDefault: () => void; }) =>{
		event.preventDefault();
		console.log(data)
		axios.post("/api/login",data)
		.then(res => {
			if(res.data=="logged in") setLogged("Logged");
			else setLogged("Username or password incorrect!");
		})
		.then(err => console.log(err));
	}

	return(
	<div className="d-flex justify-content-center">
		<div className="flex-sm-column p-4">
			<div className="p-4"/>
			<div className="d-flex justify-content-center"><h1>Login</h1></div>
			<div className='p-2'/>
			<form onSubmit={handleSubmit}>
				<label className="form-label">Username</label>
				<input type="text" onChange={e => setData({...data, user: e.target.value})} className="form-control" id="username" aria-describedby="emailHelp"/>
				<div className="form-text">We'll never share your email with anyone else.</div>
				<div className='p-2'/>
				<label className="form-label">Password</label>
				<input type="password" onChange={e => setData({...data, passwd: e.target.value})} className="form-control" id="passwd"/>
				<div className='p-2'/>
				<div className="d-flex justify-content-center">
					<button type="submit" className="btn btn-primary">Login</button>
				</div>
				<LogAttempt logged={logged}/>
				<Link to="/register"><button className="btn btn-secondary">Register</button></Link>
			</form>
		</div>
	</div>)
}

export default Login;