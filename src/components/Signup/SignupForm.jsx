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
    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full-Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
             Upload Profile Pic
            </label>
            <input 
            type="file" 
            id="avatar" 
            accept="image/*"
            onChange={(e)=> setAvatar(e.target.files[0])}
            required 
            className=""/>
          </div>
          <div>
            <label htmlFor="cover-Image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
             Upload Cover-Image
            </label>
            <input 
            type="file" 
            id="coverImage" 
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className=""/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
          <button
          type="submit"
          className={`w-full py-2 px-4 mt-4 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "SignUp"}
        </button>
        <div className="my-4-">
        <a href='/login' 
        className="underline text-md font-semibold decoration-auto decoration-sky-800 hover:decoration-2 hover:decoration-sky-300">
        Already have an account?</a>
        </div>
        </form>
      </div>
    </div>
  );
}
