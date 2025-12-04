import axios from "axios"
import { useEffect, useState } from "react"


function UsersList(){
    const [players,setPlayers] = useState([])
    const playerdisplay = []
    const getPlayers = ()=>{
        axios.get("/api/players")
        .then((res)=>{
            setPlayers(res.data)
        })
    }

    useEffect(()=>{
        const interval = setInterval(() => {
            getPlayers()
        }, 1500);
        return () => clearInterval(interval)
    },[])

    for(let i=0; i<players.length; i++){
        playerdisplay.push(<li className="list-group-item text-center" key={i}>{players[i]}</li>)
    }

    return(
	<div className="card" style={{margin:"1rem",width:"13rem",height:"20rem",scrollBehavior:"smooth", border:0}}>
			<ul className="list-group list-group-flush overflow-auto" style={{margin:"0.5rem",width:"12rem",height:"15rem"}}>
                {playerdisplay.length>0 ? playerdisplay : 
                <div className="text-center" style={{marginTop:"7.5rem"}}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                </div>
                }
            </ul>
			<div className="card-body text-center">
				<h5 className="card-title">Player list</h5>
			</div>
	</div>
	)

}

export default UsersList