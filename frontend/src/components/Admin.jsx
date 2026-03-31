import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store';

export default function Admin() {
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newQText, setNewQText] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [category, setCategory] = useState('General');
  const [difficulty, setDifficulty] = useState('medium');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchQuestions();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get('http://104.214.180.228:5000/api/quiz/leaderboard');
      setLeaderboard(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get('http://104.214.180.228:5000/api/quiz/questions');
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://104.214.180.228:5000/api/quiz/questions', {
        text: newQText, options, category, difficulty
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNewQText('');
      setOptions([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]);
      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://104.214.180.228:5000/api/quiz/questions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchQuestions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAttempt = async (id) => {
    try {
      await axios.delete(`http://104.214.180.228:5000/api/quiz/attempts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchLeaderboard();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Side */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Add Question</h2>
          <form onSubmit={handleAddQuestion}>
            <div className="mb-4">
              <label className="block text-gray-700">Question Text</label>
              <textarea
                required
                className="mt-1 w-full border rounded px-3 py-2"
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-gray-700">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full border p-2 rounded">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Options (First is Correct)</label>
              {options.map((opt, i) => (
                <input
                  key={i}
                  required
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  className={`w-full border mb-2 px-3 py-2 rounded ${i === 0 ? 'border-green-500 bg-green-50' : ''}`}
                />
              ))}
            </div>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 w-full">
              Save Question
            </button>
          </form>
        </div>

        {/* List Side */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded shadow overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-bold mb-4">Existing Questions ({questions.length})</h2>
          {questions.map(q => (
            <div key={q._id} className="border-b pb-4 mb-4">
              <p className="font-semibold">{q.text}</p>
              <div className="text-sm text-gray-500 mb-2 flex justify-between">
                <span>[{q.category}] - {q.difficulty}</span>
                <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
              </div>
              <ul className="text-sm pl-4 list-disc">
                {q.options.map((opt, i) => (
                  <li key={i} className={opt.isCorrect ? 'text-green-600 font-bold' : ''}>{opt.text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">User Leaderboard (Top 10)</h2>
        {leaderboard.length === 0 ? <p>No attempts yet.</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">User</th>
                  <th className="py-2">Score</th>
                  <th className="py-2 text-center">Total Questions</th>
                  <th className="py-2">Date</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(att => (
                  <tr key={att._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-semibold text-indigo-600">
                      {att.userId?.name || 'Unknown'}
                      <span className="text-gray-400 text-xs ml-2 bg-gray-100 rounded px-2 py-0.5">Attempt #{att.attemptNumber || 1}</span>
                    </td>
                    <td className="py-3 font-bold px-2 rounded"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">{att.score}</span></td>
                    <td className="py-3 text-center">{att.totalQuestions}</td>
                    <td className="py-3 text-sm text-gray-500">{new Date(att.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => handleDeleteAttempt(att._id)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
