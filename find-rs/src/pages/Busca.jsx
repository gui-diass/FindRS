import { useState } from 'react';
import axios from 'axios';

export default function Busca() {
  const [fotoBusca, setFotoBusca] = useState(null);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fotoBusca) return alert('Envie uma foto para buscar.');

    const formData = new FormData();
    formData.append('foto', fotoBusca);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/buscar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResultado(res.data);
    } catch (err) {
      console.error('Erro ao buscar pessoa:', err);
      alert('Erro ao processar a busca.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Buscar Pessoa por Foto</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center'
      }}></div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFotoBusca(e.target.files[0])}
          required
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: '12px',
            padding: '10px 20px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Procurar
        </button>
      </form>

      {loading && <p>Buscando...</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {resultado.map((pessoa) => (
          <div key={pessoa._id} style={{ border: '1px solid #000', padding: '10px', borderRadius: '8px', width: '200px' }}>
            <img
              src={`http://localhost:5000/uploads/${pessoa.foto}`}
              alt={pessoa.nome}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <p><strong>{pessoa.nome}</strong></p>
            <p style={{ fontSize: '0.9em' }}>Abrigo: {pessoa.abrigo?.nome || 'Desconhecido'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}