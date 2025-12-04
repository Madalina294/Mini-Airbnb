import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import type { LoginRequest } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

/**
 * LoginForm Component
 * Similar cu un Angular Component cu template-driven form
 */
export const LoginForm = () => {
  // State pentru form fields (controlled components)
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginRequest, string>>>({});

  // Hook pentru login mutation
  const loginMutation = useLogin();
  const navigate = useNavigate();

  // Handler pentru input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Șterge eroarea când utilizatorul începe să scrie
    if (errors[name as keyof LoginRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validare simplă
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginRequest, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler pentru submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne default form submission

    if (!validate()) {
      return;
    }

    // Apelează mutation-ul
    loginMutation.mutate(formData, {
      onSuccess: () => {
        // Redirect către home după login reușit
        navigate('/home');
      },
      onError: (error: any) => {
        // Gestionează eroarea (ex: email sau parolă greșită)
        const errorMessage = error?.response?.data?.error?.message || 'Login failed';
        setErrors({ email: errorMessage });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <div className="formGroup">
        <label htmlFor="email" className="formLabel">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          className={`formInput ${errors.email ? 'border-red-500' : ''}`}
          required
        />
        {errors.email && (
          <span className="formError">{errors.email}</span>
        )}
      </div>

      <div className="formGroup">
        <label htmlFor="password" className="formLabel">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={`formInput ${errors.password ? 'border-red-500' : ''}`}
          required
        />
        {errors.password && (
          <span className="formError">{errors.password}</span>
        )}
      </div>

      {loginMutation.isError && (
        <div className="errorMessage">
          {loginMutation.error?.message || 'An error occurred. Please try again.'}
        </div>
      )}

      <button
        type="submit"
        className={`loginButton ${loginMutation.isPending ? 'loading' : ''}`}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="loginFooter">
        <p className="loginFooterText">
          Don't have an account?{' '}
          <a href="/register" className="registerLink" onClick={(e) => {
            e.preventDefault();
            navigate('/register');
          }}>
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};