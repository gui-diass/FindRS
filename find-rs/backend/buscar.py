from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
from PIL import Image
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson import ObjectId

UPLOADS_FOLDER = "uploads"
TEMP_FOLDER = "uploads_temp"
THRESHOLD = 0.4  # Ideal para ArcFace + cosine

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOADS_FOLDER

client = MongoClient("mongodb://localhost:27017/")
db = client["findrs"]
pessoas_collection = db["pessoas"]
abrigos_collection = db["abrigos"]

@app.route('/api/buscar', methods=['POST'])
def buscar_pessoa():
    if 'foto' not in request.files:
        return jsonify({'error': 'Nenhuma imagem foi enviada'}), 400

    foto = request.files['foto']
    if foto.filename == '':
        return jsonify({'error': 'Nome de arquivo inválido'}), 400

    os.makedirs(TEMP_FOLDER, exist_ok=True)
    caminho_temporario = os.path.join(TEMP_FOLDER, "foto_teste.jpg")
    foto.save(caminho_temporario)

    try:
        arquivos = [
            os.path.join(app.config['UPLOAD_FOLDER'], f)
            for f in os.listdir(app.config['UPLOAD_FOLDER'])
            if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.startswith("ds_model")
        ]

        if not arquivos:
            return jsonify({'correspondencias': []}), 200

        resultado = DeepFace.find(
            img_path=caminho_temporario,
            db_path=app.config['UPLOAD_FOLDER'],
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=False,
            distance_metric="cosine",
            silent=True
        )

        correspondencias = []
        THRESHOLD = 0.5  # mais tolerante

        if resultado and len(resultado[0]) > 0:
            df_resultado = resultado[0].sort_values(by='distance').head(3)

            for i, pessoa_encontrada in df_resultado.iterrows():
                nome_arquivo = os.path.basename(pessoa_encontrada['identity'])
                distancia = pessoa_encontrada['distance']

                print(f"[{i}] Comparação: {nome_arquivo}, distância: {distancia:.4f}")

                if distancia > THRESHOLD:
                    continue

                pessoa = pessoas_collection.find_one({"foto": nome_arquivo})
                if not pessoa:
                    continue

                abrigo = abrigos_collection.find_one({"_id": ObjectId(pessoa["abrigoId"])})

                correspondencias.append({
                    "nome": pessoa.get("nome", "Nome não disponível"),
                    "foto": pessoa["foto"],
                    "distancia": round(distancia, 4),
                    "abrigo": {
                        "nome": abrigo.get("nome", "Desconhecido"),
                        "cidade": abrigo.get("cidade", ""),
                        "bairro": abrigo.get("bairro", ""),
                        "rua": abrigo.get("rua", ""),
                        "numero": abrigo.get("numero", "")
                    }
                })

        return jsonify({"correspondencias": correspondencias}), 200

    except Exception as e:
        print("Erro ao processar busca:", str(e))
        return jsonify({'error': 'Erro ao comparar imagens'}), 500

    finally:
        if os.path.exists(caminho_temporario):
            os.remove(caminho_temporario)


if __name__ == '__main__':
    app.run(port=5001)
