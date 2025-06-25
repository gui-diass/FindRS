import { useState } from 'react';
import axios from 'axios';

export default function Busca() {
  const [fotoBusca, setFotoBusca] = useState(null);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");

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
    setResultado([]);

    try {
      const res = await axios.post("http://localhost:5001/api/buscar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.correspondencias.length === 0) {
        setMensagem("Nenhuma pessoa compatível foi encontrada.");
      } else {
        setResultado(res.data.correspondencias);
      }

    } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
      setMensagem("Erro ao buscar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoBusca(file);
      setNomeArquivo(file.name);
    }
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '12px'
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>Buscar Pessoa por Foto</h2>

      <form onSubmit={handleSubmit} style={{
        background: '#f9f9f9',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '0 auto 30px auto'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="inputArquivo"
        />

        <button
          type="button"
          onClick={() => document.getElementById('inputArquivo').click()}
          style={buttonStyle}
        >
          Selecionar Foto
        </button>

        {nomeArquivo && (
          <p style={{
            fontSize: '0.9rem',
            color: '#333',
            marginBottom: '16px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            Arquivo selecionado: <strong>{nomeArquivo}</strong>
          </p>
        )}

        <button type="submit" style={buttonStyle}>
          Procurar
        </button>
      </form>

      {loading && <p style={{ marginTop: '20px' }}>Buscando...</p>}

      {mensagem && (
        <p style={{ color: "red", marginTop: "20px", fontWeight: 'bold' }}>
          {mensagem}
        </p>
      )}

      {resultado.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '30px'
        }}>
          {resultado.map((pessoa, i) => (
            <div key={i} style={{
              border: '2px solid #000',
              padding: '16px',
              borderRadius: '10px',
              width: '220px',
              textAlign: 'center'
            }}>
              <img
                src={`http://localhost:5000/uploads/${pessoa.foto}`}
                alt={pessoa.nome}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '12px'
                }}
              />
              <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                {pessoa.nome || 'Nome não disponível'}
              </p>
              <p style={{ fontSize: '0.9em', lineHeight: '1.4' }}>
                Abrigo: {pessoa.abrigo?.nome}<br />
                Endereço: {pessoa.abrigo?.rua}, {pessoa.abrigo?.numero}, {pessoa.abrigo?.bairro}, {pessoa.abrigo?.cidade}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
