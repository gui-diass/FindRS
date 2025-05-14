export default function Abrigo() {
  const handleAdd = () => {
    alert("Adicionar nova pessoa abrigada");
  };

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
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Área do Abrigo</h2>
      {/* Conteúdo aqui */}
      <button style={fabStyle} onClick={handleAdd}>+</button>
    </div>
  );
}
