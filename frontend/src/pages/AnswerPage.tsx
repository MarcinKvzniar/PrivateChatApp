import React, { useState } from 'react';

const AnswerPage: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const correctAnswer = 'blue'; // Simulated correct answer

  const handleSubmit = () => {
    if (answer === correctAnswer) {
      alert("Correct answer! You're now friends.");
    } else {
      alert('Incorrect answer. Try again.');
    }
  };

  return (
    <div>
      <h1>Answer Page</h1>
      <p>Inviter ID: 12345</p>
      <p>Question: What's your favorite color?</p>
      <input
        type="text"
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Answer</button>
    </div>
  );
};

export default AnswerPage;
