import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { LoginForm, useAuthStore } from '../../features/auth';

/**
 * LoginPage - Pagina de login
 * Similar cu un Angular Component cu routing
 */
export const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect dacă utilizatorul este deja autentificat
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <div className="loginCard">
          <div className="loginHeader">
            <h2 className="loginTitle">Welcome back</h2>
            <p className="loginSubtitle">Sign in to your account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};