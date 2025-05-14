import { useParams } from 'react-router-dom';

export default function AbrigoPainel() {
  const { id } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Painel do Abrigo</h2>
      <p>ID do abrigo logado: <strong>{id}</strong></p>
      <p>Aqui você poderá adicionar pessoas e fotos futuramente.</p>
    </div>
  );
}
