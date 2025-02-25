import Link from "next/link";

export default function HomeNavbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link href="../profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
