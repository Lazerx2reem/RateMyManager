// pages/auth.js
import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "/firebase";

export default function AuthPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
      })
      .catch((error) => console.error("Sign Out Error:", error));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login / Sign Up</h1>

      {!user ? (
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="text-center">
          <h2 className="text-xl">Welcome, {user.displayName}</h2>
          <img
            src={user.photoURL}
            alt="Profile"
            className="rounded-full w-24 h-24 mx-auto my-4"
          />
          <button
            onClick={handleSignOut}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
