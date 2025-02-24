import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HomeNavbar from "../components/HomeNavbar";
import { useState } from "react";
import axios from "axios";

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
  const [showManagerInput, setShowManagerInput] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [manager, setManager] = useState("");

  // Function to handle search query for companies using Yelp API
  const handleCompanySearch = async (query) => {
    if (query.trim() === "") {
      setCompanies([]);
      return;
    }

    // Use the Yelp API for search (replace with your actual API key)
    const API_KEY = "YOUR_YELP_API_KEY";  // Replace with your Yelp API Key
    const endpoint = `https://api.yelp.com/v3/businesses/search?term=business&location=${query}`;

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      // If results are found, process them
      if (response.data.businesses && response.data.businesses.length > 0) {
        const businessNames = response.data.businesses.map((business) => business.name);
        setCompanies(businessNames);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching data from Yelp API:", error);
    }
  };

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

  // Handle selecting a company from the dropdown
  const handleCompanySelect = (companyName) => {
    setCompany(companyName);
    setCompanies([]);  // Clear dropdown after selection
    setShowManagerInput(true);  // Show manager input form
  };

  return (
    <div>
      <HomeNavbar />
      <Image src="/logo.png" width={300} height={200} />
      
      {!showManagerInput ? (
        <form onSubmit={handleCompanySubmit} className="flex flex-col items-center space-y-4 relative">
          <input
            type="text"
            placeholder="Enter Company Name"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              handleCompanySearch(e.target.value); // Trigger search as user types
            }}
            className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          
          {/* Dropdown for Company Results */}
          {companies.length > 0 && (
            <div className="absolute bg-white border border-gray-300 mt-2 w-80 rounded-lg shadow-lg z-10">
              <ul>
                {companies.map((companyName, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCompanySelect(companyName)}
                  >
                    {companyName}
                  </li>
                ))}
              </ul>
            </div>
          )}

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