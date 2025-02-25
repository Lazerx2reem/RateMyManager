import Link from "next/link";
import { auth } from "../firebase";

export default function HomeNavbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link href="../auth/login">Login</Link></li>
        <li><Link href="../auth/signup">Sign Up</Link></li>
        <li><Link href="../profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
