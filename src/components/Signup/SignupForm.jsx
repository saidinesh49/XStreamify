import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useUserContext } from "../../context/UserContext";
import { registerUser } from "../../services/authService";
import { toast } from 'react-toastify';

export function SignupForm() {
  const [fullName, setfullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);


  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addUserData } = useUserContext(); // Get addUserData from context

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(password !== confirmPassword) {
      toast.error('Passwords do not match!', {
      icon: '❌'
      });
      setError("Password & Confirm do not match.");
      setIsSubmitting(false);
      return;
    }
    setError(null);
    
    const response = await registerUser(
      fullName,
      username, 
      password,
      email, 
      avatar, 
      coverImage, 
      addUserData
    );
    
    if (response?.username) {
      toast.success('Account created successfully! Welcome aboard!', {
      icon: '🎉'
      });
      navigate("/");
    } else {
      toast.error('Failed to create account. Please check your details.', {
      icon: '⚠️'
      });
      setError("Please fill details properly and try again.");
    }
    
    setIsSubmitting(false);
  };
  

  return (
    <div className="flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Profile Picture
            </label>
            <input 
              type="file" 
              id="avatar" 
              accept="image/*"
              onChange={(e)=> setAvatar(e.target.files[0])}
              required 
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="cover-Image" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Cover Image
            </label>
            <input 
              type="file" 
              id="coverImage" 
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-premium-500 text-surface-800 dark:text-white transition-all duration-200"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              isSubmitting
                ? "bg-surface-400 cursor-not-allowed"
                : "bg-gradient-to-r from-premium-500 to-premium-600 hover:from-premium-600 hover:to-premium-700 text-black"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
          <div className="mt-4">
            <a 
              href="/login"
              className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-premium-500 dark:hover:text-premium-400 transition-colors"
            >
              Already have an account? Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
