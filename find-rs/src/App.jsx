import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Abrigo from './pages/Abrigo';
import AbrigoPainel from './pages/AbrigoPainel';
import Busca from './pages/Busca';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/abrigo" element={<Abrigo />} />
      <Route path="/abrigo/:id" element={<AbrigoPainel />} />
      <Route path="/busca" element={<Busca />} />
    </Routes>
  );
}

export default App;
