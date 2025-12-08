import { useState } from "react";


function CreateQuestion({n,choice,quests,remove}:{n:number,choice:(c:string) => void,quests:(c:string) => void,remove: ()=> void}){
	const [choices,setChoices] = useState<Array<string>>(['',''])
	const choiceIn = []
	const [choiceNumber,setChoiceNumber] = useState<number>(2)
	
	const logChoice = (e:string,i:number) =>{
		const newChoices = [...choices.slice(0,i),e,...choices.slice(i+1)]
		choice(newChoices.join(';'))
		setChoices(newChoices)
	}

	const addChoice = ()=>{
		const newChoices = [...choices,'']
		choice(newChoices.join(';'))
		setChoices(newChoices)
		setChoiceNumber(choiceNumber+1)
	}

	const removeChoice = ()=>{
		if(choiceNumber-1>1){
			const newChoices = choices.slice(0,choiceNumber-1)
			choice(newChoices.join(';'))
			setChoices(newChoices)
			setChoiceNumber(choiceNumber-1)
		}
	}

	for(let i=0; i< choiceNumber; i++){
		choiceIn.push(<input key={i} type="text" className="form-control" onChange={e => logChoice(e.target.value,i)} style={{width:"8.5rem",marginRight:"0.5rem",marginBottom:"0.5rem"}}/>)
	}


	return(
		<div className="flex-column p-4" style={{width:"40rem"}}>
			<label className="form-label">Question {n}</label>
			<button type="button" className="btn-close" onClick={remove} style={{fontSize:"0.7rem",marginLeft:"0.5rem",backgroundColor:"#A0A0A0"}}></button>
			<input type="text" className="form-control" onChange={(e)=>quests(e.target.value)}/>
			<div className='p-2'/>
			<label className="form-label">Answers</label>
			<div className="d-flex flex-row flex-wrap justify-content-start">
				{choiceIn}
				<div style={{width:"1.5rem"}}/>
				<div className="d-flex justify-content-center">
					<button className="btn btn-danger" onClick={removeChoice}>X</button>
					<button className="btn btn-secondary" onClick={addChoice}>Add Answer</button>
				</div>
			</div>
		</div>
	)
}

export default CreateQuestion