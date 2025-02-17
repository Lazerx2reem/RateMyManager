import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Dummy user authentication
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return { id: "1", name: "Test User", email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect to a custom login page if needed
  },
  secret: process.env.NEXTAUTH_SECRET,
});
