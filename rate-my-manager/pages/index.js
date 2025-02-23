import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HomeNavbar from "../components/HomeNavbar";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [company, setCompany] = useState("");
  const [manager, setManager] = useState("");
  const [showManagerInput, setShowManagerInput] = useState(false);

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (company.trim() !== "") {
      setShowManagerInput(true);
    }
  };

  const handleManagerSubmit = (e) => {
    e.preventDefault();
    alert(`Company: ${company}\nManager: ${manager}`);
  };

  return(
    <div>
      <HomeNavbar />
    <Image 
        src="/logo.png"
        width={300}
        height={200}/>
        {!showManagerInput ? (
        <form onSubmit={handleCompanySubmit} className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Enter Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Next
          </button>
        </form>
      ) : (
        <form onSubmit={handleManagerSubmit} className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">Company: {company}</h2>
          <input
            type="text"
            placeholder="Enter Manager's Name"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
