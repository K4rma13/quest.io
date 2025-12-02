import { useEffect, useState } from "react";
import axios from "axios";

function Simple(){
    const [data,setData] = useState([]);
    useEffect(() => {
        axios.get('/api').then(
            res => setData(res.data)
        ).catch(err => console.error(err))
    },[])

    return(
        <h1>BANANAS = {JSON.stringify(data)}</h1>
    );
}

export default Simple