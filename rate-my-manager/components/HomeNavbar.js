import Link from "next/link";

export default function HomeNavbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
}
