import React, { useState } from 'react';
import axios from 'axios';

function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await axios.post("http://localhost:8000/api/query/", { query });
    setResults(res.data.results);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Search
        </button>
      </div>

      <ul className="space-y-3">
        {results.map((chunk, index) => (
          <li
            key={index}
            className="p-4 bg-white border rounded shadow"
          >
            {chunk.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBox;
