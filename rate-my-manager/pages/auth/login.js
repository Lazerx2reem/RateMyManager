import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, provider } from "/firebase"; // Adjust path based on your project structure
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
  
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true); // Prevent multiple clicks
  
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
      
      // Redirect to home page after successful login
      router.push("/home");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3 text-black" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3 text-black" required />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Login

          </button>{/* Google Sign-In Button with added margin-top */}
          <button onClick={handleGoogleSignIn} disabled={loading}className={`w-full px-6 py-2 rounded-lg mt-4 ${loading ? "bg-gray-400" : "bg-purple-500 text-white"}`}>
            {loading ? "Signing in..." : "Sign in with Google"}</button>
        </form>
        <p className="mt-3 text-center text-sm text-black">
          Don't have an account? <a href="/auth/signup" className="text-blue-600">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;