import axios from "axios"

export async function isLogged(){
	let logged:boolean = false;
	await axios.get("/api/logged")
	.then((res)=>{
		if(res.data!="not logged") logged=true;
	}).then((err) =>{
		console.log(err)
	})
	return logged;
}

export async function userName(){
	let user:string = "";
	await axios.get("/api/logged")
	.then((res)=>{
		console.log(res.data)
		if(res.data!="not logged") user=res.data;
	}).then((err) =>{
		console.log(err)
	})
	return user;
}