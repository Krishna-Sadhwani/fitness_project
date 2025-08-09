import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage'
import Header from './components/ui/Header'
import Register from './components/Register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white text-3xl font-bold">
      🎉 Tailwind CSS is Working!
    </div> */}
    {/* <LandingPage/> */}
    <Register/>
    </>
  )
}

export default App
