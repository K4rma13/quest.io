import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react"

interface data{
	choice:string,
	players: Array<string>
}

function ListPopup({show,toggle,data}:{show:boolean,toggle?: () => void,data:data}){
	const modalRef = useRef(null);
	const [bsModal,setBsModal] = useState<Modal>();


	const hideModal = () => {
		if(bsModal) {
			bsModal.hide()
		}
	}
	const showModal = ()=> {
		if(bsModal) {
			if(toggle) toggle()
			bsModal.show()
		}
	}

	useEffect(()=>{
		if(modalRef.current){
			const modalEle = modalRef.current
			const mod = new Modal(modalEle, {})
			setBsModal(mod)
		}
	},[])

	if(show) showModal()
	else hideModal()

	const playerdisplay = []

	for(let i=0; i<data.players.length; i++){
        playerdisplay.push(<li className="list-group-item text-center" key={i}>{data.players[i]}</li>)
    }

	return(
		<div className="modal fade" tabIndex={-1} ref={modalRef}>
			<div className="modal-dialog modal-dialog-centered" >
				<div className="modal-content" style={{margin:"1rem",width:"13rem",height:"20rem",scrollBehavior:"smooth", backgroundColor:"#333333ff"}}>
					<div className="modal-header">
						<h5 className="modal-title" id="staticBackdropLabel">{data.choice}</h5>
						<button type="button" className="btn-close" onClick={hideModal} aria-label="Close"></button>
					</div>
					<div className="modal-body">
						<ul className="list-group list-group-flush overflow-auto" style={{margin:"-0.5rem",width:"12rem",height:"15rem"}}>
							{playerdisplay}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ListPopup;