import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { LoginRequest } from '../api/auth.api';

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
      onError: (error: any) => {
        // Gestionează eroarea (ex: email sau parolă greșită)
        const errorMessage = error?.response?.data?.error?.message || 'Login failed';
        setErrors({ email: errorMessage });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <Input
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="your.email@example.com"
        required
      />

      <Input
        type="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter your password"
        required
      />

      {loginMutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {loginMutation.error?.message || 'An error occurred'}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={loginMutation.isPending}
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
};