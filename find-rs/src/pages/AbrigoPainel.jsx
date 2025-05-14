import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AbrigoPainel() {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [nomePessoa, setNomePessoa] = useState('');
    const [foto, setFoto] = useState(null);
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

    const handleDeletePessoa = async (id) => {
        const confirmar = window.confirm('Deseja realmente excluir esta pessoa?');
        if (!confirmar) return;
        try {
            await axios.delete(`http://localhost:5000/api/pessoas/${id}`);
            fetchPessoas();
        } catch (err) {
            console.error('Erro ao excluir pessoa:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!foto) {
            alert('Selecione uma foto antes de enviar.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nome', nomePessoa);
            formData.append('foto', foto);
            formData.append('abrigoId', localStorage.getItem('abrigoId'));

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
            fetchPessoas();
        } catch (err) {
            console.error('Erro ao enviar:', err);
            alert('Erro ao enviar a foto. Tente novamente.');
        }
    };

    useEffect(() => {
        fetchPessoas();
    }, []);

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
                Enviar foto
            </button>

            {showUploadModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                                fontSize: '30px',
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

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 240px)',
                gap: '16px',
                marginTop: '40px',
                justifyContent: 'start'
            }}>
                {pessoas.map((pessoa) => (
                    <div key={pessoa._id} style={{
                        border: '2px solid #000',
                        padding: '12px',
                        borderRadius: '10px',
                        width: '220px',
                        height: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        textAlign: 'center'
                    }}>
                        <img
                            src={`http://localhost:5000/uploads/${pessoa.foto}`}
                            alt={pessoa.nome}
                            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <p style={{ margin: '8px 0', fontWeight: 'bold' }}>{pessoa.nome}</p>
                        <button
                            onClick={() => handleDeletePessoa(pessoa._id)}
                            style={{
                                backgroundColor: '#dc2626',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer'
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
