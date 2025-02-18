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
    <div>
    <header class = "main">
      <div id= "navigation">
      <ul>
        <li><a href = "#">Login</a></li>
        <li><a href="#">Sign Up</a></li>
      </ul>
      </div>
    </header>
    <div className="image-container">
    <Image 
          src="https://motionarray.imgix.net/preview-70417GayIL9G01E_0009.jpg?w=660&q=60&fit=max&auto=format"
          alt="Descriptive text for the image"
          width={800} 
          height={400} 
          className="rounded-lg shadow-lg"
          />
    </div>
    
    </div>
  );
}
