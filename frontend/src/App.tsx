import React from 'react';
import InvitePage from './pages/InvitePage';
import RequestPage from './pages/RequestPage';
import AnswerPage from './pages/AnswerPage';

const App: React.FC = () => {
  return (
    <div>
      <h1>Private Chat App</h1>
      <InvitePage />
      <RequestPage />
      <AnswerPage />
    </div>
  );
};

export default App;
