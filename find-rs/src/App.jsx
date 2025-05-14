import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Abrigo from './pages/Abrigo';
import AbrigoPainel from './pages/AbrigoPainel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/abrigo" element={<Abrigo />} />
      <Route path="/abrigo/:id" element={<AbrigoPainel />} />
    </Routes>
  );
}

export default App;
