import { useState } from "react"
import socket from "./socket"
import { Button } from "bootstrap"
import AnswerGraph from "./AnswerGraph"

interface data{
	quest: string,
	options: Array<string>,
	values: Array<Array<string>>
}

function Questions(){
	const [option,setOption] = useState(-1)
	const [answers,setAnswers] = useState([])
	const answerbtns = []
	const [owner,setOwner] = useState(false)
	const [currRes,setcurrRes] = useState(0)
	const [results,setResults] = useState<data>();
	const [quest,setQuest] = useState("Waiting for game to begin")

	const startGame = ()=>{
		socket.emit("start_game")
	}
	
	socket.on("question",(res)=>{
		console.log(res)
		setQuest(res.quest)
		setAnswers(res.ans)
		setOwner(res.owner)
		if(res.quest=="Results") socket.emit("results");
		if(res.owner && res.quest == "Waiting for game to begin") setQuest("Press to Begin")
		else if(res.owner && res.quest == "Waiting for Results") setQuest("Press to show Results")
	})

	socket.on("results",(res)=>{
		if(!res){
			setcurrRes(0)
		}
		setResults(res)
		console.log(res)
	})

	const requestResults = ()=>{
		socket.emit("result_request")
	}

	const nextResult = (i:number) =>{
		if(currRes+i>=0) {
			setcurrRes(currRes+i)
			socket.emit("result_request",currRes+i)
		}
	}

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

	const ownerControl = ()=>{
		if(quest=="Press to Begin") return(<button className="btn btn-primary" type="submit" onClick={startGame}>Begin</button>)
		else if(quest=="Press to show Results") {
			return(<button className="btn btn-primary" type="submit" onClick={requestResults}>Results</button>)
		}

		else return(
			<div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
		);
	}	


	if(results){
		return (
			<div className="d-flex flex-column justify-content-center"> 
				<AnswerGraph data={results} />
				{owner ?
				<div>
					<button className="btn btn-primary" type="submit" onClick={()=> nextResult(-1)}>Prev</button>
					<button className="btn btn-primary" type="submit" onClick={()=> nextResult(1)}>Next</button>
				</div>
				:<></>}
			</div>
		)
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
				{ownerControl()}
            </div>
			}
		</div>
	)
}

export default Questions;