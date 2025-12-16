import { useState } from "react"
import CreateQuestion from "./utilities/CreateQuestion"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Questionaire(){
	const [title,setTitle] = useState<string>("")
	const [questNumber,setQuestNumber] = useState<number>(1)
	const [choices,setChoices] = useState<Array<string>>([''])
	const [removed,setRemoved] = useState<Array<number>>([])
	const [questions,setQuestions] = useState<Array<string>>([''])
	const navigate = useNavigate()

	const logChoice = (e:string,i:number) =>{
		const newChoices = [...choices.slice(0,i),e,...choices.slice(i+1)]
		setChoices(newChoices)
	}
	const logQuestion = (e:string,i:number) =>{
		const newQuestion = [...questions.slice(0,i),e,...questions.slice(i+1)]
		setQuestions(newQuestion)
	}
	

	const quest = []
	
	const newQuest = ()=>{
		setQuestions([...questions,''])
		setChoices([...choices,''])
		setQuestNumber(questNumber+1)
	}

	const removeQuest = (n:number) =>{
		let i=0;
		for(i=0;removed[i]<n;i++){ /* empty */ }
		setRemoved([...removed.slice(0,i),n,...removed.slice(i)])
	}
	

	
	
	let j =0;
	for(let i =0; i< questNumber; i++){
		if(removed[j]!=i){
			quest.push(<CreateQuestion n={i+1-j} key={i} remove={()=>removeQuest(i)} choice={(c)=>logChoice(c,i)} quests={(c)=>logQuestion(c,i)}/>)
		}
		else{
			j++;
		} 
	}

	const sendQuestionaire = ()=> {
		const questSend = []
		const ansSend = []
		let j =0;
		let err=title=="";
		for(let i=0; i<questNumber && !err;i++){
			if(removed[j]!=i){
				err=questions[i]=="" || choices[i].split(";").indexOf("")!=-1;
				questSend.push(questions[i])
				ansSend.push(choices[i])
			}
			else{
				j++;
			}
		}
		console.log(title)
		console.log(questSend)
		console.log(ansSend)
		console.log(choices)
		console.log(err)
		const data = {
			title: title,
			questions: questSend,
			answers: ansSend
		}
		if(!err){
			axios.post("/api/createquest",data)
			.then(res =>{
				if(res.data=="success") navigate("/")
			})
		}
	}

	return(
		<>
		<h1 className="text-center mt-5 mb-3">Create Questionnaire</h1>
		<div className="d-flex flex-column justify-content-center">
			<div className="flex-column p-4" style={{width:"40rem"}}>
				<h5>Questionnaire Title</h5>
				<input type="text" className="form-control" onChange={(e)=>setTitle(e.target.value)}/>
			</div>
			{quest}
		</div>
		<button className="btn btn-primary" style={{width:"10rem",height:"3rem",marginLeft:"2rem"}} onClick={newQuest}>
			Add Question
		</button>
		<button className="btn btn-primary" onClick={sendQuestionaire}>Save</button>
		</>
	)
}

export default Questionaire