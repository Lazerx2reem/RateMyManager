import { useState } from "react";
import { auth, db, provider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Email & Password Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email
      });

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email
      }, { merge: true });

      router.push("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Sign Up</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full px-6 py-2 rounded-lg mb-4 text-white ${loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"}`}
        >
          {loading ? "Signing in..." : "Sign up with Google"}
        </button>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-3 border border-purple-300 rounded text-purple-700"
            required
          />
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-purple-700">
          Already have an account? <a href="/auth/login" className="text-purple-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
