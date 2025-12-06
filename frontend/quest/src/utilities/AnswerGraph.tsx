// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ListPopup from "./ListPopup";
import { useState } from "react";
interface data{
	quest: string,
	options: Array<string>,
	values: Array<Array<string>>
}

interface popdata{
	choice:string,
	players: Array<string>
}

function AnswerGraph({data}:{data:data}){
	const [popup,setPopup] = useState(false)
	const [popdata,setPopdata] = useState<popdata>({choice:"",players:[]});
	

	return(
		<>
		<ListPopup show={popup} toggle={()=>setPopup(false)} data={popdata} />
		<div className="d-flex flex-column justify-content-center" style={{margin:"1rem",width: "28rem",height: "20rem"}}>
			<h1 className="text-center">{data.quest}</h1>
		<Bar 
			data={{
				labels: data.options,
				datasets:[{
					label: "yes",
					data: data.values.map((d) => d.length),
					backgroundColor: "#5f829eff",
					borderColor: "#A0A0A0",
					borderRadius: 20,
					hoverBackgroundColor: "#729cbeff",
					
				}],
			}}
			options={{
				scales:{
					x:{
						grid:{
							display:false
						}
					},
					y:{
						ticks: {
							stepSize:1
						},
						border: {
							display: false
						}
					}
				},
				plugins:{
					legend:{
						display:false
					},
					tooltip:{
						enabled:false
					}
				},
				interaction:{
					mode:'point',
					intersect: true
				},
				onClick: (_,chr) => {
					if(chr[0]){
						const pop ={
							choice: data.options[chr[0].index],
							players: data.values[chr[0].index]
						}
						setPopup(true)
						setPopdata(pop)
					}
				}
			}}
		/>
		</div>
		</>
	)
}

export default AnswerGraph;