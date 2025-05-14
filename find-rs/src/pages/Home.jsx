import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const buttonStyle = {
    padding: '16px 24px',
    margin: '12px 0',
    width: '90%',
    maxWidth: '300px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px',
    paddingLeft: '16px',
    paddingRight: '16px',
  }

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={() => navigate('/abrigo')}
        onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
      >
        Abrigo
      </button>
      
      <button
        style={buttonStyle}
        onClick={() => navigate('/busca')}
        onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
      >
        Buscar
      </button>
    </div>
  )
}
