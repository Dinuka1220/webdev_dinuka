import { useState } from 'react'
import './App.css'
import HeroSection from "./assets/Componants/Pages/HomePage/HeroSection.jsx";
import ServicesPage from "./assets/Componants/Pages/HomePage/ServicesPage.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <HeroSection/>
        <ServicesPage/>
    </>
  )
}

export default App
