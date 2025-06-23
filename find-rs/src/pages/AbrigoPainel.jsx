import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function AbrigoPainel() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [nomePessoa, setNomePessoa] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [cameraLigada, setCameraLigada] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const [pessoas, setPessoas] = useState([]);

  const fetchPessoas = async () => {
    try {
      const abrigoId = localStorage.getItem('abrigoId');
      const res = await axios.get(`http://localhost:5000/api/pessoas?abrigoId=${abrigoId}`);
      setPessoas(res.data);
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const abrirCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraLigada(true);
    } catch (err) {
      console.error('Erro ao abrir a câmera:', err);
      alert('Não foi possível acessar a câmera.');
    }
  };

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const capturarFoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      setFotoCapturada(blob);
      fecharCamera();
    }, 'image/jpeg');
  };

  const fecharCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraLigada(false);
    setCameraStream(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foto && !fotoCapturada) {
      alert('Selecione uma foto ou tire uma foto antes de enviar.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nome', nomePessoa);
      formData.append('abrigoId', localStorage.getItem('abrigoId'));

      if (fotoCapturada) {
        formData.append('foto', fotoCapturada, 'foto-capturada.jpg');
      } else if (foto) {
        formData.append('foto', foto);
      }

      await axios.post('http://localhost:5000/api/pessoas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert('Pessoa cadastrada com sucesso!');
      setShowUploadModal(false);
      setNomePessoa('');
      setFoto(null);
      setFotoCapturada(null);
      fetchPessoas();
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('Erro ao enviar a foto.');
    }
  };

  const handleDeletePessoa = async (id) => {
    if (window.confirm('Deseja realmente excluir esta pessoa?')) {
      try {
        await axios.delete(`http://localhost:5000/api/pessoas/${id}`);
        fetchPessoas();
      } catch (err) {
        console.error('Erro ao excluir pessoa:', err);
      }
    }
  };

  const handleExcluirTodasPessoas = async () => {
    if (window.confirm('Tem certeza que deseja excluir TODAS as pessoas deste abrigo?')) {
      try {
        const abrigoId = localStorage.getItem('abrigoId');
        await axios.delete(`http://localhost:5000/api/pessoas/todas/${abrigoId}`);
        alert('Todas as pessoas foram excluídas.');
        fetchPessoas();
      } catch (err) {
        console.error('Erro ao excluir todas as pessoas:', err);
        alert('Erro ao excluir todas as pessoas.');
      }
    }
  };

  const handleDeleteAbrigo = async () => {
    if (window.confirm('Tem certeza que deseja excluir o abrigo? Esta ação é permanente.')) {
      const abrigoId = localStorage.getItem('abrigoId');
      try {
        await axios.delete(`http://localhost:5000/api/abrigos/${abrigoId}`);
        alert('Abrigo excluído com sucesso!');
        localStorage.removeItem('token');
        localStorage.removeItem('abrigoId');
        window.location.href = '/';
      } catch (err) {
        console.error('Erro ao excluir abrigo:', err);
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          alert('Erro ao excluir o abrigo.');
        }
      }
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '1.8rem' }}>Cadastro de Pessoas Abrigadas</h2>

      {/* Botões de ação */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '30px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            flex: '1 1 180px',
            padding: '12px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Enviar foto
        </button>

        <button
          onClick={handleExcluirTodasPessoas}
          style={{
            flex: '1 1 180px',
            padding: '12px',
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Excluir Todas as Pessoas
        </button>

        <button
          onClick={handleDeleteAbrigo}
          style={{
            flex: '1 1 180px',
            padding: '12px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Excluir Abrigo
        </button>
      </div>

      {/* Modal Upload */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: '24px', borderRadius: '12px',
            width: '90%', maxWidth: '400px', textAlign: 'left', position: 'relative'
          }}>
            <button onClick={() => {
              setShowUploadModal(false);
              fecharCamera();
              setFoto(null);
              setFotoCapturada(null);
            }} style={{
              position: 'absolute', top: '10px', right: '14px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer'
            }}>×</button>

            <h3>Enviar Foto de Pessoa Abrigada</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome da pessoa"
                value={nomePessoa}
                onChange={(e) => setNomePessoa(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginBottom: '10px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
                style={{ marginBottom: '10px', width: '100%' }}
              />

              {!cameraLigada && (
                <button type="button" onClick={abrirCamera} style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }}>
                  Tirar Foto com a Câmera
                </button>
              )}

              {cameraLigada && (
                <div>
                  <video ref={videoRef} autoPlay style={{
                    width: '100%',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }} />

                  <button type="button" onClick={capturarFoto} style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    Capturar Foto
                  </button>

                  <button type="button" onClick={fecharCamera} style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Fechar Câmera
                  </button>
                </div>
              )}

              {fotoCapturada && (
                <img
                  src={URL.createObjectURL(fotoCapturada)}
                  alt="Capturada"
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    borderRadius: '6px'
                  }}
                />
              )}

              <button type="submit" style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '12px'
              }}>
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid de Pessoas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 240px)',
        gap: '16px',
        marginTop: '30px',
        maxWidth: '1100px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {pessoas.map((pessoa) => (
          <div key={pessoa._id} style={{
            border: '2px solid #000',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <img
              src={`http://localhost:5000/uploads/${pessoa.foto}`}
              alt={pessoa.nome}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                borderRadius: '6px'
              }}
            />
            <p style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>{pessoa.nome}</p>
            <button
              onClick={() => handleDeletePessoa(pessoa._id)}
              style={{
                marginTop: '8px',
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
