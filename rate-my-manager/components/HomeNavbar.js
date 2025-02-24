import Link from "next/link";
import { auth } from "../lib/firebaseConfig";

export default function HomeNavbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link href="../auth/login">Login</Link></li>
        <li><Link href="../signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
}
