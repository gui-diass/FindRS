import { useState } from 'react'
import './index.css';


export default function Abrigo() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    email: '',
    senha: '',
  })

  const [abrigos, setAbrigados] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Dados enviados:', form)
    setAbrigados((prev) => [...prev, form])
    setForm({
      nome: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      email: '',
      senha: '',
    })
    setShowModal(false)
  }

  const fabStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontSize: '32px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
  }

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }

  const formStyle = {
    position: 'relative',
    background: '#fff',
    padding: '32px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
  }

  const submitStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  }

  const closeButtonStyle = {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#333',
  }

  const cardStyle = {
    border: '2px solid #000',
    borderRadius: '8px',
    padding: '16px',
    width: '100%',
    maxWidth: '300px',
    wordWrap: 'break-word',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Área do Abrigo</h2>

      {/* Lista de abrigos criados */}
      <div className="cards-container">
        {abrigos.map((abrigo, index) => (
          <div key={index} className="card-abrigo">
            <h3 style={{ margin: '0 0 8px 0' }}>{abrigo.nome}</h3>
            <p style={{ margin: 0 }}>
              {abrigo.rua}, {abrigo.numero} - {abrigo.bairro}, {abrigo.cidade}
            </p>
          </div>
        ))}
      </div>

      {/* Botão flutuante */}
      <button style={fabStyle} onClick={() => setShowModal(true)}>+</button>

      {/* Modal */}
      {showModal && (
        <div style={modalStyle}>
          <div style={formStyle}>
            <button
              onClick={() => setShowModal(false)}
              style={closeButtonStyle}
              aria-label="Fechar"
            >
              ×
            </button>
            <h3 style={{ marginBottom: '20px' }}>Criar Abrigo</h3>
            <form onSubmit={handleSubmit}>
              <input
                style={inputStyle}
                type="text"
                name="nome"
                placeholder="Nome do abrigo"
                value={form.nome}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={form.cidade}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={form.bairro}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="text"
                name="rua"
                placeholder="Rua"
                value={form.rua}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="text"
                name="numero"
                placeholder="Número"
                value={form.numero}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="email"
                name="email"
                placeholder="E-mail do responsável"
                value={form.email}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="password"
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleInputChange}
                required
              />
              <button type="submit" style={submitStyle}>Criar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
