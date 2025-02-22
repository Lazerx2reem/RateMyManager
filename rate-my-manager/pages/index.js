import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import HomeNavbar from "../components/HomeNavbar";


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
    <div>
      <HomeNavbar />
    <Image 
        src="/Rate_My_Manager_logo.png"
        width={300}
        height={200}/>
    </div>
  );
}
