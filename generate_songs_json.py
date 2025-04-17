import os
import json

#### GENERATES THE songs.json FILE ####

base_dir = os.path.join(os.path.dirname(__file__), "songs")
output_path = os.path.join(os.path.dirname(__file__), "songs.json")

songs_data = []

if os.path.exists(base_dir):
    for folder in sorted(os.listdir(base_dir)):
        folder_path = os.path.join(base_dir, folder)
        if os.path.isdir(folder_path):
            files = sorted(os.listdir(folder_path))

            stimmen = [f for f in files if f.lower().endswith(".mp3")]
            video = next((f for f in files if f.lower().endswith(".mp4")), None)
            partitur = next((f for f in files if f.lower().endswith(".pdf")), None)

            if stimmen and video and partitur:
                songs_data.append({
                    "title": folder,
                    "folder": folder,
                    "stimmen": stimmen,
                    "video": video,
                    "partitur": partitur
                })

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(songs_data, f, ensure_ascii=False, indent=2)

print(f"{len(songs_data)} Songs verarbeitet. Datei gespeichert unter: {output_path}")
