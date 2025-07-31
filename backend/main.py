from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from utils.audio_trim import detect_silence_ranges, trim_audio
import tempfile, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect_silence(file: UploadFile, threshold: float = Form(...), duration: float = Form(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    silence_ranges = detect_silence_ranges(tmp_path, threshold, duration)

    os.remove(tmp_path)
    return {"silence_ranges": silence_ranges}

@app.post("/trim")
async def trim_file(file: UploadFile, threshold: float = Form(...), duration: float = Form(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    trimmed_path = trim_audio(tmp_path, threshold, duration)
    return FileResponse(trimmed_path, filename="trimmed.wav")
