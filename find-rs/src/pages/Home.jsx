import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Você é:</h1>
      <button onClick={() => navigate('/abrigo')} style={{ margin: '10px', padding: '10px 20px' }}>
        Abrigo
      </button>
      <button onClick={() => navigate('/busca')} style={{ margin: '10px', padding: '10px 20px' }}>
        Buscador (Familiar ou Pessoa Procurando)
      </button>
    </div>
  )
}
