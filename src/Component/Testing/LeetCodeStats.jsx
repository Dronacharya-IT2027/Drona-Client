import React, { useState } from "react";

const LeetCodeStats = () => {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!username) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`http://localhost:5000/api/leetcode/${username}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setData(result);
    } catch (err) {
      setError("Failed to fetch data. Please check the username or server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">LeetCode Stats Viewer</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter LeetCode username"
          className="border rounded-lg p-2 w-64"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Fetch Stats
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">👤 {username}</h2>
          <p className="mb-4">
            <strong>Total Solved:</strong> {data.totalSolved} / {data.totalQuestions}
          </p>

          <h3 className="font-semibold mb-2">🧩 Recent Accepted Questions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.recent.map((item) => (
              <li key={item.id}>
                <a
                  href={`https://leetcode.com/problems/${item.titleSlug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.id}
                </a>{" "}
                ({new Date(item.timestamp * 1000).toLocaleString()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeetCodeStats;
