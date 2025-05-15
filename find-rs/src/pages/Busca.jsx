import { useState } from 'react';
import axios from 'axios';

export default function Busca() {
  const [fotoBusca, setFotoBusca] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fotoBusca) {
      setMensagem("Selecione uma imagem antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", fotoBusca);

    setLoading(true);
    setMensagem("");

    try {
      const res = await axios.post("http://localhost:5001/api/buscar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResultado(res.data);
    } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
      if (error.response && error.response.status === 404) {
        setResultado(null);
        setMensagem("Nenhuma pessoa compatível foi encontrada.");
      } else {
        setMensagem("Erro ao buscar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Buscar Pessoa por Foto</h2>

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
      {mensagem && <p style={{ color: "red", marginTop: "1rem" }}>{mensagem}</p>}

      {resultado?.foto && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <div style={{
            border: '1px solid #000',
            padding: '10px',
            borderRadius: '8px',
            width: '200px'
          }}>
            <img
              src={`http://localhost:5000/uploads/${resultado.foto}`}
              alt={resultado.nome}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <p><strong>{resultado.nome || 'Nome não disponível'}</strong></p>
            <p style={{ fontSize: '0.9em' }}>Abrigo: {resultado.abrigo?.nome || 'Desconhecido'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
