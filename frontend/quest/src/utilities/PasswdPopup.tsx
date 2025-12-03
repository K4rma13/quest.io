import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react"

function PasswdPopup({show,toggle,passwd}:{show:boolean,toggle?: () => void, passwd:(a:string)=>void}){
	const modalRef = useRef(null);
	const [bsModal,setBsModal] = useState<Modal>();
	const inputRef = useRef<HTMLInputElement>(null);


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

	const sendPass = (event: { preventDefault: () => void; }) =>{
		event.preventDefault();
		hideModal()
		if(inputRef.current) {
			passwd(inputRef.current.value)
			inputRef.current.value = ""
		}
	}

	if(show) showModal()
	else hideModal()

	return(
		<div className="modal fade" tabIndex={-1} ref={modalRef}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="staticBackdropLabel">Room Password</h5>
						<button type="button" className="btn-close" onClick={hideModal} aria-label="Close"></button>
					</div>
					<form onSubmit={sendPass}>
						<div className="modal-body">
							<input type="password" className="form-control" ref={inputRef}></input>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" onClick={hideModal}>Close</button>
							<button className="btn btn-primary" type="submit">Join</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default PasswdPopup