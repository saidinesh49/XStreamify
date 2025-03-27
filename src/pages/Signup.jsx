import React from "react";
import { SignupForm } from "../components/Signup/SignupForm";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-900 pt-20">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-premium-400 to-premium-600 bg-clip-text text-transparent mb-6">
          You are welcome
        </h2>
        <p className="text-center text-surface-600 dark:text-surface-400 mb-6">
          Create your account.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
