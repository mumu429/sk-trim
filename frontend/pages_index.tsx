import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState("30");
  const [duration, setDuration] = useState("0.5");
  const [silenceResult, setSilenceResult] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const detectSilence = async () => {
    if (!file) return alert("파일을 업로드하세요.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("threshold", threshold);
    formData.append("duration", duration);

    const res = await axios.post(`${API_BASE}/detect`, formData);
    setSilenceResult(JSON.stringify(res.data.silence_ranges));
  };

  const trimFile = async () => {
    if (!file) return alert("파일을 업로드하세요.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("threshold", threshold);
    formData.append("duration", duration);

    const res = await axios.post(`${API_BASE}/trim`, formData, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    setDownloadUrl(url);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">SK Trim</h1>

        <input type="file" accept="audio/*" onChange={handleFileChange} className="mb-4 w-full" />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Silence Threshold (dB)</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Min Silence Duration (sec)</label>
          <input
            type="number"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={detectSilence}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Detect Silence
          </button>
          <button
            onClick={trimFile}
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Trim
          </button>
        </div>

        {silenceResult && (
          <div className="text-sm bg-gray-100 p-2 rounded mb-4">
            Detected Silence: {silenceResult}
          </div>
        )}

        {downloadUrl && (
          <a
            href={downloadUrl}
            download="trimmed.wav"
            className="block bg-purple-500 text-white text-center py-2 rounded hover:bg-purple-600"
          >
            Download Trimmed File
          </a>
        )}
      </div>
    </div>
  );
}
