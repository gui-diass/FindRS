import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Abrigo from './pages/Abrigo'
import Busca from './pages/Busca'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/abrigo" element={<Abrigo />} />
      <Route path="/busca" element={<Busca />} />
    </Routes>
  )
}
