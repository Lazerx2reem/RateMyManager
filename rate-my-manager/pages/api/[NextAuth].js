import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return { id: "1", name: "User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
