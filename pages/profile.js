import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ProfileNavbar from "../components/ProfileNavbar";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserName(userDoc.data().name); // Set name from Firestore
          } else {
            setUserName("User"); // Fallback name if not found
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserName("User"); // Fallback in case of error
        } finally {
          setLoading(false); // Stop loading after fetching user data
        }
      } else {
        setUserName(null); // Reset name if no user is logged in
        setLoading(false); // Stop loading when there's no user
      }
    });

    return () => unsubscribe(); // Cleanup the auth state listener
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <ProfileNavbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">Dashboard</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
        <h2 className="text-2xl font-semibold text-purple-600">{userName}</h2>
        <p className="text-gray-600 mt-2">{user.email}</p>
        <button
          onClick={handleLogout}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-purple-600"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
  );
}
