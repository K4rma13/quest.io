import { useEffect, useRef, useState } from "react"
import socket from "./socket"
import { useNavigate } from "react-router-dom";


function Chat(){
	const chatRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [messages,setMessages] = useState([""])
	const navigate = useNavigate()
	const chat = []
	
	

	const dataFun = (arg:string) =>{
		setMessages([...messages,arg])
	}
	

	socket.on("data", dataFun)

	

	useEffect(()=>{
		const conFun = ()=>{
			console.log(socket.id)
		}
		socket.disconnect().connect();
		
		socket.on("connect", conFun)

		socket.on("connect_error", err => {
			navigate("/")
			console.log("Connection error:", err);
		});

		return () => {
			socket.off("connect", conFun)
		}
	},[navigate])

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	const socketMessage = (event: { preventDefault: () => void; }) =>{
		event.preventDefault();
		if(inputRef.current) {
			socket.emit("message",inputRef.current.value)
			inputRef.current.value = "";
		}
	}

	for(let i = 0; i<messages.length;i++){
		chat.push(<p key={i} className="card-text p-1 mb-0">{messages[i]}</p>)
	}

	return(
		<div className="card" style={{margin:"1rem",width: "18rem",height: "20rem",scrollBehavior:"smooth"}}>
			<div className="card-body text-center">
				<h5 className="card-title">Chat</h5>
			</div>
			<div ref={chatRef} data-bs-spy="scroll" className="d-flex flex-column overflow-auto mb-0" style={{margin:"1rem"}}>
				{chat}
			</div>
			<form onSubmit={socketMessage}>
				<div className="d-flex flex-row">
					<input ref={inputRef} type="text" className="form-control"></input>
					<button className="btn btn-primary" type="submit">Send</button>
				</div>
			</form>
		</div>
	)
}

export default Chat