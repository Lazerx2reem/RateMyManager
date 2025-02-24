import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!session ? (
        <>
          <h1 className="text-3xl font-bold">Login to Rate My Manager</h1>
          <button
            onClick={() => signIn("google")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Sign In with Google
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl">Welcome, {session.user.name}</h1>
          <button
            onClick={() => signOut()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}
