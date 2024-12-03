import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Oops! You wrote something stupid.</h1>
      <p>
        There is no such route. You will be redirected to the login page
        shortly.
      </p>
    </div>
  );
};

export default NotFoundPage;
