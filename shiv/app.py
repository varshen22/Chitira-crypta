from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from stego_decode import decode_data_from_image

app = Flask(__name__)
CORS(app) 

@app.route('/api/decode', methods=['POST'])
def decode_endpoint():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    passphrase = request.form.get('passphrase', 'taravusecret') 
    
    temp_path = "temp_upload.png"
    file.save(temp_path)
    
    try:
        extracted_json_string = decode_data_from_image(temp_path, passphrase)
        os.remove(temp_path) 
        return jsonify({"success": True, "data": json.loads(extracted_json_string)}), 200
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    print("🚀 Taravu API running on http://localhost:5000")
    app.run(port=5000, debug=True)