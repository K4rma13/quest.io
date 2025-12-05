import { useState } from "react"
import socket from "./socket"
import { Button } from "bootstrap"


function Questions(){
	const [option,setOption] = useState(-1)
	const [answers,setAnswers] = useState([])
	const answerbtns = []
	const [quest,setQuest] = useState("Waiting for game to begin")

	const startGame = ()=>{
		socket.emit("start_game")
	}
	
	socket.on("question",(res)=>{
		console.log(res)
		setQuest(res.quest)
		setAnswers(res.ans)
	})

	const btnToggle = (i:number)=>{
		if(option>-1){
			const b = new Button(`#btn${option}`)
			b.toggle()
		}
		const b = new Button(`#btn${i}`)
		b.toggle()
		setOption(i)
	}
	const sendOption = () => {
		if(option!=-1){
			console.log(option)
			setAnswers([])
			setQuest("Waiting for everyone...")
			socket.emit("option",option)
			setOption(-1)
		}
	}

	for(let i=0; i< answers.length; i++){
		answerbtns.push(<button id={`btn${i}`} className="btn btn-secondary p-3 ms-2 mb-2 " key={i} onClick={()=>btnToggle(i)}>{answers[i]}</button>)
	}

	
	return(
		<div className="d-flex flex-column justify-content-center" style={{margin:"1rem",width: "28rem",height: "20rem"}}>
			<h1 className="text-center">{quest}</h1>
			{answerbtns.length>0 ? <>
			<div className="d-flex flex-wrap">
				{answerbtns}
			</div>
			<div className="text-center">
			<button className="btn btn-primary p-3 ms-2 mb-2" style={{width:"8rem"}} onClick={sendOption}>Confirm</button>
			</div>
			</>
			: 
			<div className="text-center" style={{marginTop:"3rem"}}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
				<button className="btn btn-primary" type="submit" onClick={startGame}>Send</button>
            </div>
			}
		</div>
	)
}

export default Questions;