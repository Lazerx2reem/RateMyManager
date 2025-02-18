import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return(
    <header class = "main">
      <div id= "navigation">
      <ul>
        <li><a href = "#">Login</a></li>
        <li><a href="#">Sign Up</a></li>
      </ul>
      </div>
    </header>
  );
}
