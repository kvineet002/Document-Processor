import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AllUploads() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(3);
  const [answer, setAnswer] = useState(null);
  const [answerLoading, setAnswerLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/documents/');
        setDocuments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const [currentDocTitle,setCurrentDocTitle] = useState(null);
  const openModal = (docId,docTitle) => {
    setCurrentDocTitle(docTitle);
    setCurrentDocId(docId);
    setQuestion('');
    setTopK(3);
    setAnswer(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
        setAnswerLoading(true);
      const response = await axios.post('http://localhost:8000/api/documents/ask/', {
        document_id: currentDocId,
        question,
        top_k: topK
      });
        setAnswerLoading(false);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer("Error getting answer.");
    }
    finally {
        setAnswerLoading(false);
        }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Uploaded Documents</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Size (KB)</th>
                <th className="py-2 px-4 border">Pages</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Uploaded</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{doc.title}</td>
                  <td className="py-2 px-4 border">{doc.file_type.toUpperCase()}</td>
                  <td className="py-2 px-4 border">{(doc.file_size / 1024).toFixed(2)}</td>
                  <td className="py-2 px-4 border">{doc.num_pages}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      doc.processing_status === 'done' ? 'bg-green-100 text-green-800' :
                      doc.processing_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.processing_status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">{new Date(doc.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => openModal(doc.id,doc.title)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded"
                    >
                      Ask Question
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center border justify-center z-50">
            <div className=' flex border '>
          <div className="bg-white p-6 rounded shadow-md w-96 relative">
            <h3 className="text-lg font-semibold mb-4">Ask a Question</h3>
            <p className="text-sm text-gray-500 mb-2">Document Name: {currentDocTitle}</p>

            <label className="block mb-2 text-sm font-medium">Question:</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Enter your question"
            />

            <label className="block mb-2 text-sm font-medium">Top K (optional):</label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-4"
              value={topK}
              onChange={e => setTopK(Number(e.target.value))}
              min={1}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black font-bold px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!question.trim()}
                className="bg-orange-500 text-white px-3 py-1 font-bold rounded hover:bg-orange-600"
              >
                Submit
              </button>
            </div>
            </div>
            <div className=' flex flex-col items-center justify-center  w-96 bg-white p-6 rounded shadow-md'>
            {answerLoading && ( 
                <div className="mt-4 text-sm text-gray-500">Loading answer...</div>
            )}
            {answer&&!answerLoading && (
              <div className="mt-4 p-2 bg-green-100 text-green-800 rounded text-sm">
                <strong>Answer:</strong> {answer}
              </div>
            )}
            {!answer && !answerLoading && (
              <div className="mt-4 text-sm text-gray-500">No answer yet.</div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUploads;
