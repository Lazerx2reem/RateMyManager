import Link from "next/link";

export default function ManagerNavbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/profile">My Profile</Link></li>
      </ul>
    </nav>
  );
}
