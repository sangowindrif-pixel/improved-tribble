from flask import Flask, render_template, jsonify
from pathlib import Path

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
MUSIC_DIR = BASE_DIR / "static" / "music"
AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"}

def get_tracks():
    MUSIC_DIR.mkdir(parents=True, exist_ok=True)
    tracks = []
    for path in sorted(MUSIC_DIR.iterdir()):
        if path.is_file() and path.suffix.lower() in AUDIO_EXTENSIONS:
            tracks.append({
                "title": path.stem.replace("-", " ").replace("_", " ").title(),
                "artist": "Votre bibliothèque",
                "src": "/static/music/" + path.name,
                "filename": path.name
            })
    return tracks

@app.route("/")
def index():
    return render_template("index.html", tracks=get_tracks())

@app.route("/api/tracks")
def api_tracks():
    return jsonify(get_tracks())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
