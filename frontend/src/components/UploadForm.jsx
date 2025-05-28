import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
    await  axios.post("http://localhost:8000/api/documents/upload/", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
}});
      setMessage("Upload successful!");
    } catch (error) {
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="mb-8">
      <div className='flex flex-col items-center justify-center mb-4'>
          Upload your file here
          <div>
            👇👇
          </div>
        </div> 
        <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4"
      >
       
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-900 border border-gray-300 p-2 cursor-pointer bg-gray-50"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export default UploadForm;
