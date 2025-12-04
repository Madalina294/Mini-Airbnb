import { RegisterForm } from '../../features/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { useAuthStore } from '../../features/auth';

/**
 * RegisterPage - Pagina de register
 */
export const RegisterPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect dacă utilizatorul este deja autentificat
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="registerPage">
      <div className="registerContainer">
        <div className="registerCard">
          <div className="registerHeader">
            <h2 className="registerTitle">Create account</h2>
            <p className="registerSubtitle">Sign up to get started</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};