import { useState } from 'react';
import axios from 'axios';
import { isValidEmail } from '../utils/validation';

interface AuthFormData {
  name: string;
  email: string;
  otp: string;
  userId: string;
}

/**
 * Manages authentication logic for sign-up and sign-in
 * @param type The authentication type ('sign-up' or 'sign-in')
 */
export const useAuth = (type: 'sign-up' | 'sign-in') => {
  const [formData, setFormData] = useState<AuthFormData>({ name: '', email: '', otp: '', userId: '' });
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      if (!value) {
        setEmailError('Email is required');
      } else if (!isValidEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleGetOtp = async () => {
    if (!formData.email) {
      setEmailError('Email is required');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (type === 'sign-up') {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
          email: formData.email,
          name: formData.name,
        });
        setFormData((prev) => ({ ...prev, userId: response.data.userId }));
        setShowOtpField(true);
      } else {
        const response = await axios.post(`${BASE_URL}/auth/otp/send`, {
          email: formData.email,
          action: 'login',
        });
        setFormData((prev) => ({ ...prev, userId: response.data.userId }));
        setShowOtpField(true);
        setResendCooldown(30);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/otp/send`, {
        email: formData.email,
        action: 'login',
      });
      setFormData((prev) => ({ ...prev, userId: response.data.userId }));
      setResendCooldown(30);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (showOtpField && !formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/otp/verify`, {
        userId: formData.userId,
        otp: formData.otp,
        action: type === 'sign-up' ? 'signup' : 'login',
        keepLoggedIn: type === 'sign-in' ? keepLoggedIn : false,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const keepLoggedInParam = type === 'sign-in' ? `?keepLoggedIn=${keepLoggedIn}` : '';
    window.location.href = `${BASE_URL}/auth/google${keepLoggedInParam}`;
  };

  return {
    formData,
    keepLoggedIn,
    showOtpField,
    emailError,
    error,
    loading,
    resendCooldown,
    setKeepLoggedIn,
    setShowOtpField,
    setResendCooldown,
    handleInputChange,
    handleGetOtp,
    handleResendOtp,
    handleSubmit,
    handleGoogleAuth,
  };
};