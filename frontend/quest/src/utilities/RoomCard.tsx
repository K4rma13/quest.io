
import axios from "axios"
import { useState } from "react"
import { Navigate } from "react-router-dom"

export interface roominfo {
    label: string,
    descr: string,
    id: number,
    capacity: number,
    passwd: boolean,
    count: number
}

function RoomCard({children}:{children:roominfo}){
    const [joined,setJoined] = useState(false)

    const joinRoom = ()=>{
        console.log(children.id)
        axios.post("/api/joinroom",{id:children.id})
        .then(res=>{
            setJoined(res.data)
        })
    }

    return(
    <div className="p-2">
        {joined ? <Navigate to="/room" replace /> : <></>}
        <div className="card" style={{width: "16rem"}}>
            <div className="card-body text-center">
                <h5 className="card-title">{children.label} {children.passwd ? <>🔒</> : <></>}</h5>
                <p className="card-text">{children.descr}</p>
                <div>
                    <button className="btn btn-info" onClick={joinRoom}>Join</button>
                    <p className="card-text">{children.count}/{children.capacity} 🧑 </p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default RoomCard