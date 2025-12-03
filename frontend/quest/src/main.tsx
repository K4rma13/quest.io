import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/custom.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.tsx'

//const htmlElement = document.querySelector('html');
//htmlElement.setAttribute('data-bs-theme','dark');
document.body.classList.add('dark')

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		
		<div className='theme-dark'>
			<App />
		</div>
	</StrictMode>,
)
