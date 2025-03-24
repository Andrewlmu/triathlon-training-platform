"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * SignUpForm Component
 * 
 * Provides registration form for new user account creation.
 * Handles form validation, submission, and error states.
 * Redirects to sign-in page after successful registration.
 * 
 * @returns A sign-up form component with name, email, and password fields
 */
export default function SignUpForm() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Router for navigation after sign-up
  const router = useRouter();

  /**
   * Handle form submission
   * Validates inputs and creates new user account
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!email || !password) {
      setError("Please fill out all fields");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Submit registration data to API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      
      // Redirect to sign in page after successful signup
      router.push("/auth/signin");
    } catch (err) {
      setError("An error occurred during sign up");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#333333]">
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
        
        {/* Error message display */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Sign-up form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input (optional) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
            />
          </div>
          
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              required
            />
          </div>
          
          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white focus:ring-[#FFD700] focus:border-[#FFD700] focus:outline-none"
              required
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          
          {/* Link to sign in */}
          <p className="text-sm text-center text-[#A0A0A0] mt-4">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-[#FFD700] hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}