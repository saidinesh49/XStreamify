import React from "react";
import { SignupForm } from "../components/Signup/SignupForm";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          You are welcome
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Create your account.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
