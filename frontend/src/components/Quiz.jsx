import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store';
import { motion } from 'framer-motion';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/quiz/questions');
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      submitScore(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  const submitScore = async (finalScore, total) => {
    try {
      await axios.post('http://localhost:5000/api/quiz/attempts', 
        { score: finalScore, totalQuestions: total },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (error) {
      console.error('Error saving score', error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading quiz...</div>;
  if (questions.length === 0) return <div className="text-center mt-10">No questions available. Admin needs to add some!</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {showScore ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Quiz Completed!</h2>
          <p className="text-xl">You scored {score} out of {questions.length}</p>
          <button 
             onClick={() => window.location.reload()}
             className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-bold"
          >
            Play Again
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="bg-white p-8 rounded shadow"
        >
          <div className="mb-6 flex justify-between items-center text-gray-500 text-sm font-semibold">
            <span>Question {currentQuestion + 1} / {questions.length}</span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{questions[currentQuestion].difficulty}</span>
          </div>
          <h2 className="text-2xl font-bold mb-6">{questions[currentQuestion].text}</h2>
          <div className="flex flex-col space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(option.isCorrect)}
                className="w-full bg-gray-50 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-left font-semibold py-3 px-4 rounded transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
