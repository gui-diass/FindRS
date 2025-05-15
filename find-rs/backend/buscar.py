from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
from werkzeug.utils import secure_filename

UPLOADS_FOLDER = "uploads"  # ajusta conforme o caminho da sua pasta de imagens

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOADS_FOLDER

@app.route('/api/buscar', methods=['POST'])
def buscar_pessoa():
    if 'foto' not in request.files:
        return jsonify({'error': 'Nenhuma imagem foi enviada'}), 400

    foto = request.files['foto']
    if foto.filename == '':
        return jsonify({'error': 'Nome de arquivo inválido'}), 400

    caminho_temporario = os.path.join("uploads_temp", "foto_teste.jpg")
    foto.save(caminho_temporario)

    try:
        # Encontra todas as imagens cadastradas
        arquivos = [
            os.path.join(app.config['UPLOAD_FOLDER'], f)
            for f in os.listdir(app.config['UPLOAD_FOLDER'])
            if f.lower().endswith(('.png', '.jpg', '.jpeg')) and f != "foto_teste.jpg"
        ]

        if not arquivos:
            return jsonify({'error': 'Nenhuma imagem cadastrada'}), 404

        resultado = DeepFace.find(
            img_path=caminho_temporario,
            db_path=app.config['UPLOAD_FOLDER'],
            enforce_detection=False
        )

        if resultado and len(resultado[0]) > 0:
            pessoa_encontrada = resultado[0].iloc[0]
            nome_arquivo = os.path.basename(pessoa_encontrada['identity'])

            print("Pessoa encontrada:", nome_arquivo)
            print("Distância da correspondência:", pessoa_encontrada['distance'])

            if pessoa_encontrada['distance'] > 0.55:
                print("Sem correspondência confiável.")
                return jsonify({ "erro": "Nenhuma pessoa compatível encontrada." }), 404

            return jsonify({
                'foto': nome_arquivo
            })

        return jsonify({'message': 'Nenhuma correspondência encontrada'}), 404

    except Exception as e:
        print("Erro ao processar busca:", str(e))
        return jsonify({'error': 'Erro ao comparar imagens'}), 500
    finally:
        if os.path.exists(caminho_temporario):
            os.remove(caminho_temporario)

if __name__ == '__main__':
    app.run(port=5001)
