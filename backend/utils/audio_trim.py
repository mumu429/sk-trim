from pydub import AudioSegment, silence
import tempfile

def detect_silence_ranges(audio_path, threshold, duration):
    audio = AudioSegment.from_file(audio_path)
    silence_ranges = silence.detect_silence(
        audio,
        min_silence_len=int(duration * 1000),
        silence_thresh=audio.dBFS - threshold
    )
    return silence_ranges

def trim_audio(audio_path, threshold, duration):
    audio = AudioSegment.from_file(audio_path)
    silence_ranges = detect_silence_ranges(audio_path, threshold, duration)

    if silence_ranges:
        start = silence_ranges[0][1]
        end = silence_ranges[-1][0]
        trimmed = audio[start:end]
    else:
        trimmed = audio

    output_path = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
    trimmed.export(output_path, format="wav")
    return output_path
