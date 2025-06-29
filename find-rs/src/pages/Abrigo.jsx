import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Abrigo() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nome: '', cidade: '', bairro: '', rua: '', numero: '', email: '', senha: ''
  });

  const [abrigos, setAbrigados] = useState([]);
  const [abrigoSelecionado, setAbrigoSelecionado] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [loginErro, setLoginErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchAbrigos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/abrigos');
      setAbrigados(res.data);
    } catch (err) {
      console.error('Erro ao buscar abrigos:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/abrigos', form);
      setShowModal(false);
      setForm({ nome: '', cidade: '', bairro: '', rua: '', numero: '', email: '', senha: '' });
      fetchAbrigos();
    } catch (err) {
      console.error('Erro ao criar abrigo:', err);
    }
  };

  const abrirLoginParaAbrigo = (abrigo) => {
    setAbrigoSelecionado(abrigo);
    setShowLoginModal(true);
    setLoginErro('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('abrigoId', res.data.abrigo._id);
      window.location.href = `/abrigo/${res.data.abrigo._id}`;
    } catch (err) {
      setLoginErro('E-mail ou senha incorretos.');
    }
  };

  useEffect(() => { fetchAbrigos(); }, []);

  const fabStyle = {
    position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', borderRadius: '50%',
    backgroundColor: '#4f46e5', color: '#fff', fontSize: '32px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', cursor: 'pointer'
  };

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  };

  const formStyle = {
    position: 'relative', background: '#fff', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  };

  const inputStyle = {
    width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'
  };

  const submitStyle = {
    width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
  };

  const closeButtonStyle = {
    position: 'absolute', top: '12px', right: '16px', background: 'transparent', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#333'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Área do Abrigo</h2>

      <div className="cards-container">
        {abrigos.map((abrigo, index) => (
          <div key={index} className="card-abrigo" onClick={() => abrirLoginParaAbrigo(abrigo)} style={{ cursor: 'pointer' }}>
            <h3>{abrigo.nome}</h3>
            <p>{abrigo.rua}, {abrigo.numero} - {abrigo.bairro}, {abrigo.cidade}</p>
          </div>
        ))}
      </div>

      <button style={fabStyle} onClick={() => setShowModal(true)}>+</button>

      {/* Modal Criar Abrigo */}
      {showModal && (
        <div style={modalStyle}>
          <div style={formStyle}>
            <button onClick={() => setShowModal(false)} style={closeButtonStyle}>×</button>
            <h3 style={{ marginBottom: '20px' }}>Criar Abrigo</h3>
            <form onSubmit={handleSubmit}>
              {['nome', 'cidade', 'bairro', 'rua', 'numero', 'email'].map((field) => (
                <input
                  key={field}
                  style={inputStyle}
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={handleInputChange}
                  required
                />
              ))}

              {/* Campo Senha com Olho */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  style={inputStyle}
                  type={mostrarSenhaCadastro ? 'text' : 'password'}
                  name="senha"
                  placeholder="Senha (mínimo 8 caracteres)"
                  value={form.senha}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenhaCadastro((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#4f46e5'
                  }}
                >
                  {mostrarSenhaCadastro ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button type="submit" style={submitStyle}>Criar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Login */}
      {showLoginModal && (
        <div style={modalStyle}>
          <div style={formStyle}>
            <button onClick={() => setShowLoginModal(false)} style={closeButtonStyle}>×</button>
            <h3>Entrar no Abrigo</h3>
            <form onSubmit={handleLogin}>
              <input
                style={inputStyle}
                type="email"
                placeholder="E-mail"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />

              {/* Campo Senha com Olho */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  style={inputStyle}
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Senha"
                  value={loginData.senha}
                  onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#4f46e5'
                  }}
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {loginErro && <p style={{ color: 'red' }}>{loginErro}</p>}
              <button type="submit" style={submitStyle}>Entrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
