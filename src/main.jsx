import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.rtl.min.css'
import { ThemeProvider } from 'react-bootstrap'

createRoot(document.getElementById('root')).render(
 <ThemeProvider dir='rtl'>
  <App />
 </ThemeProvider>
)
