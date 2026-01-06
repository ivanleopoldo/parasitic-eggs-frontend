import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    console.log("Submitting file:", file.name, file.type, file.size);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      setResponse(response.data);
    } catch (error) {
      console.error("Error details:", error);
      const axiosError = error as any;
      console.error("Error response:", axiosError.response?.data);
      setError(axiosError.response?.data?.detail || axiosError.message);
      alert(
        `Upload failed: ${
          axiosError.response?.data?.detail || axiosError.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log("Selected file:", selectedFile.name, selectedFile.type); // Debug log
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1 className="underline text-2xl font-bold">
          Parasitic Eggs Detection
        </h1>

        <input
          type="file"
          onChange={onImageChange}
          className="filetype"
          accept="image/*"
        />

        {image && (
          <div>
            <h3>Preview:</h3>
            <img
              alt="preview"
              src={image}
              style={{ maxWidth: "300px", margin: "20px 0" }}
            />
            <p>File: {file?.name}</p>
          </div>
        )}

        <button
          onClick={submit}
          disabled={!file || loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            margin: "10px 0",
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {error && (
          <div style={{ color: "red", margin: "10px 0" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {response.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Results:</h3>
            {response.map((val, index) => (
              <div
                key={index}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  <strong>Class:</strong> {val.class}
                </p>
                <p>
                  <strong>Confidence:</strong> {(val.conf * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
