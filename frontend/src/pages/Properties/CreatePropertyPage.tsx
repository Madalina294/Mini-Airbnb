import { CreatePropertyForm } from '../../features/properties/components/CreatePropertyForm/CreatePropertyForm';
import { useAuthStore } from '../../features/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePropertyPage.css';

/**
 * CreatePropertyPage - Pagina pentru crearea unei proprietăți
 * Similar cu un Angular Component cu routing și guards
 */
export const CreatePropertyPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect dacă utilizatorul nu este autentificat
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Sau un loading spinner
  }

  return (
    <div className="createPropertyPage">
      <div className="createPropertyPageHeader">
        <div className="createPropertyPageHeaderContent">
          <h1 className="createPropertyPageTitle">Create New Property</h1>
          <p className="createPropertyPageSubtitle">
            Share your space with travelers around the world
          </p>
        </div>
      </div>

      <div className="createPropertyPageContent">
        <div className="createPropertyPageContainer">
          <CreatePropertyForm />
        </div>
      </div>
    </div>
  );
};