import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "/firebase"; // Adjust path based on your project structure
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home"); // Redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true); // Prevent multiple clicks
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
      // Redirect to home page after successful login
      router.push("/profile");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full px-6 py-2 rounded-lg mb-4 text-white ${loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"}`}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {/* Email and Password Login Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border border-purple-300 rounded text-purple-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-purple-300 rounded text-purple-700"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-purple-700">
          Don't have an account? <a href="/auth/signup" className="text-purple-600 hover:underline">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
