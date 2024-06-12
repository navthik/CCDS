import sys
sys.path.append('/home/pi/.local/lib/python3.9/site-packages')

from flask import Flask, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/positions')
def get_positions():
    # read your JSON file and return it as a response
    with open('positions.json') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run()
