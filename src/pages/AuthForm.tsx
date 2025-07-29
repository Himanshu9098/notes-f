import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { BsFillEyeFill, BsEyeSlashFill } from 'react-icons/bs';

interface AuthFormProps {
  type: 'sign-up' | 'sign-in';
}

/**
 * Authentication form for sign-up and sign-in with OTP and Google auth
 * @param type The form type ('sign-up' or 'sign-in')
 */
export default function AuthForm({ type }: AuthFormProps) {
  const {
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
  } = useAuth(type);

  const [hideValue, setHideValue] = useState(true); // true = hidden (password), false = visible (text)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, setResendCooldown]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-row w-full max-w-3xl rounded-lg bg-white shadow-md overflow-hidden">
        {/* Left side - Form */}
        <div className="flex-[1.5] flex flex-col justify-center p-8">
          <Logo />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {type === 'sign-up' ? 'Sign up' : 'Sign in'}
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              {type === 'sign-up' ? 'Sign up to enjoy the features of HD' : 'Sign in to access your HD account'}
            </p>
            <ErrorMessage message={error} />
            <form onSubmit={handleSubmit} className="space-y-6">
              {type === 'sign-up' && (
                <InputField
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  label="Your Name"
                />
              )}
              <InputField
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                label="Email"
                error={emailError}
              />

              {showOtpField && (
                <>
                  <div className="relative">
                    <InputField
                      id="otp"
                      name="otp"
                      type={hideValue ? 'password' : 'text'}
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="OTP"
                      label="OTP"
                    />
                    <button
                      type="button"
                      onClick={() => setHideValue(!hideValue)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {hideValue ? (
                        <BsFillEyeFill className="w-7 h-7 mt-5" />
                      ) : (
                        <BsEyeSlashFill className="w-7 h-7 mt-5" />
                      )}
                    </button>
                  </div>
                  {type === 'sign-in' && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading || resendCooldown > 0 || !!emailError}
                        className={`text-blue-500 hover:text-blue-600 font-medium ${
                          loading || resendCooldown > 0 || emailError ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                      </button>
                    </div>
                  )}
                </>
              )}
                            {type === 'sign-in' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-700">
                    Keep me logged in
                  </label>
                </div>
              )}
              {!showOtpField ? (
                <Button onClick={handleGetOtp} disabled={loading || !!emailError}>
                  {loading ? 'Sending OTP...' : 'Get OTP'}
                </Button>
              ) : (
                <Button type="submit" disabled={loading || !!emailError}>
                  {loading ? 'Verifying...' : type === 'sign-up' ? 'Sign up' : 'Sign in'}
                </Button>
              )}
              <Button variant="google" onClick={handleGoogleAuth} disabled={loading}>
                Sign {type === 'sign-up' ? 'up' : 'in'} with Google
              </Button>
              <p className="text-center text-gray-600">
                {type === 'sign-up' ? 'Already have an account?' : 'Don’t have an account?'}{' '}
                <Link
                  to={type === 'sign-up' ? '/signin' : '/signup'}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  {type === 'sign-up' ? 'Sign in' : 'Sign up'}
                </Link>
              </p>
            </form>
          </div>
        </div>
        <div className="flex-2 flex-col hidden lg:block">
          <div className="w-full h-full">
            <img src="/bg.png" alt="Abstract Background" className="h-full w-full rounded-r-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}