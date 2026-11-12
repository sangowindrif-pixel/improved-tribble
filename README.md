# WinMusic Web

Lecteur musical local au style noir et violet, conçu pour téléphone et ordinateur.

## Installation sur Android avec Termux

1. Installe Python et les outils nécessaires :
   ```bash
   pkg update
   pkg install python
   ```
2. Décompresse `WinMusicWeb.zip`, puis ouvre le dossier `WinMusicWeb`.
3. Installe les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
4. Lance le site :
   ```bash
   python main.py
   ```
5. Ouvre Chrome et visite `http://127.0.0.1:5000`.

## Ajouter tes musiques

Copie tes fichiers audio MP3, WAV, OGG, M4A, AAC ou FLAC dans `static/music/`, puis actualise la page. Les noms des fichiers servent de titres. Le navigateur lit les fichiers localement depuis ce dossier.

Pour arrêter le serveur dans Termux, appuie sur `CTRL` puis `C`.
