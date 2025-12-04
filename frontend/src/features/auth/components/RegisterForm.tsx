import { useState } from 'react';
import { useRegister } from '../hooks/useAuth';
import type { RegisterRequest } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

/**
 * RegisterForm Component
 */
export const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterRequest, string>>>({});

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterRequest, string>> = {};

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    registerMutation.mutate(formData, {
      onSuccess: () => {
        // Redirect către home după register reușit
        navigate('/home');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error?.message || 'Registration failed';
        if (errorMessage.includes('Email')) {
          setErrors({ email: errorMessage });
        } else {
          setErrors({ email: errorMessage });
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="registerForm">
      <div className="formRow">
        <div className="formGroup">
          <label htmlFor="firstName" className="formLabel">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className={`formInput ${errors.firstName ? 'border-red-500' : ''}`}
            required
          />
          {errors.firstName && (
            <span className="formError">{errors.firstName}</span>
          )}
        </div>

        <div className="formGroup">
          <label htmlFor="lastName" className="formLabel">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className={`formInput ${errors.lastName ? 'border-red-500' : ''}`}
            required
          />
          {errors.lastName && (
            <span className="formError">{errors.lastName}</span>
          )}
        </div>
      </div>

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

      {registerMutation.isError && (
        <div className="errorMessage">
          {registerMutation.error?.message || 'An error occurred. Please try again.'}
        </div>
      )}

      <button
        type="submit"
        className={`registerButton ${registerMutation.isPending ? 'loading' : ''}`}
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="registerFooter">
        <p className="registerFooterText">
          Already have an account?{' '}
          <a href="/login" className="loginLink" onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}>
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
};