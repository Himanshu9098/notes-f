import React, { useState } from "react";
import axios from "axios";

type AuthFormProps = {
  type: 'sign-up' | 'sign-in';
};

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    userId: "", // Store userId from register/otp send
  });
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetOtp = async () => {
    if (!formData.email) {
      setError("Email is required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (type === "sign-up") {
        const response = await axios.post("http://localhost:5000/auth/register", {
          email: formData.email,
          name: formData.name,
        });
        setFormData((prev) => ({ ...prev, userId: (response.data as { userId: string }).userId }));
        setShowOtpField(true);
      } else {
        const response = await axios.post("http://localhost:5000/auth/otp/send", {
          email: formData.email,
          action: "login",
        });
        setFormData((prev) => ({ ...prev, userId: (response.data as { userId: string }).userId }));
        setShowOtpField(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showOtpField && !formData.otp) {
      setError("Please enter the OTP");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/auth/otp/verify", {
        userId: formData.userId,
        otp: formData.otp,
        action: type === "sign-up" ? "signup" : "login",
      });
      const data = response.data as { token: string; user: any };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-row w-full max-w-3xl rounded-lg bg-white shadow-md overflow-hidden">
        {/* Left side - Form */}
        <div className="flex-[1.5] flex flex-col justify-center p-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">HD</span>
            </div>
          </div>

          {/* Form */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {type === "sign-up" ? "Sign up" : "Sign in"}
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              {type === "sign-up" ? "Sign up to enjoy the features of HD" : "Sign in to access your HD account"}
            </p>

            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field - Only for sign-up */}
              {type === "sign-up" && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* OTP Field - Only shown after Get OTP is clicked */}
              {showOtpField && (
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="otp"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="OTP"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              {!showOtpField ? (
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Get OTP"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : type === "sign-up" ? "Sign up" : "Sign in"}
                </button>
              )}

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.649,9.393-11.305H12.545z"
                  />
                </svg>
                Sign {type === "sign-up" ? "up" : "in"} with Google
              </button>

              {/* Sign in/up link */}
              <p className="text-center text-gray-600">
                {type === "sign-up" ? "Already have an account?" : "Don’t have an account?"}{" "}
                <a
                  href={type === "sign-up" ? "/signin" : "/signup"}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  {type === "sign-up" ? "Sign in" : "Sign up"}
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - Abstract Background */}
        <div className="flex-2 flex-col hidden lg:block">
          <div className="w-full h-full">
            <img
              src="/bg.png"
              alt="Abstract Background"
              className="h-full w-full rounded-r-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}