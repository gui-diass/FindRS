import { useState } from 'react';

export default function AbrigoPainel() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [nomePessoa, setNomePessoa] = useState('');
  const [foto, setFoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nome:', nomePessoa);
    console.log('Foto:', foto);
    // Aqui você vai fazer o POST com FormData
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Cadastro de Pessoas Abrigadas</h2>

      <button
        onClick={() => setShowUploadModal(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        📤 Enviar foto
      </button>

      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            textAlign: 'left',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowUploadModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#333',
              }}
            >
              ×
            </button>

            <h3>Enviar Foto de Pessoa Abrigada</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome da pessoa"
                value={nomePessoa}
                onChange={(e) => setNomePessoa(e.target.value)}
                required
                style={{ width: '100%', margin: '12px 0', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
                required
                style={{ marginBottom: '16px' }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
