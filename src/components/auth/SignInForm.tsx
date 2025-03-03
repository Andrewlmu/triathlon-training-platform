"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password
      });
      
      if (result?.error) {
        setError("Invalid email or password");
        return;
      }
      
      router.push("/");
      router.refresh();
    } catch (error) {
      setError("An error occurred during sign in");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#333333]">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-[#121212] bg-[#FFD700] hover:bg-[#F0C800] rounded-md transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <p className="text-sm text-center text-[#A0A0A0] mt-4">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-[#FFD700] hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}