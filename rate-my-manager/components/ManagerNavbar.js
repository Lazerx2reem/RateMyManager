import Link from "next/link";

export default function ManagerNavbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between text-white">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/managers">All Managers</Link></li>
        <li><Link href="/profile">My Profile</Link></li>
      </ul>
    </nav>
  );
}
