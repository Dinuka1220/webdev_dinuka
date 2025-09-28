import { useState } from 'react'
import './App.css'
import HeroSection from "./assets/Componants/Pages/HomePage/HeroSection.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <HeroSection/>
    </>
  )
}

export default App
