import { useState } from "react";
import { useRouter } from "next/router";
import { ref, set } from "firebase/database";
import { database } from "../../firebase";

export default function AddCompany() {
  const [companyLocation, setCompanyLocation] = useState("");
  const router = useRouter();
  const { companyName } = router.query;

  const handleAddCompanyLocation = async () => {
    if (!companyLocation.trim()) {
      alert("Please enter a valid location.");
      return;
    }

    const normalizedCompanyName = companyName.trim().toLowerCase();
    const companyRef = ref(database, "companies/" + normalizedCompanyName);

    await set(companyRef, {
      originalName: companyName,
      location: companyLocation,
    });

    alert("Company added successfully!");
    router.push("/"); // Redirect back to the homepage to enter manager's name
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-xl font-semibold">Add Location for {companyName}</h1>
      <input
        type="text"
        placeholder="Enter Company Location"
        value={companyLocation}
        onChange={(e) => setCompanyLocation(e.target.value)}
        className="w-80 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        required
      />
      <button
        onClick={handleAddCompanyLocation}
        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
      >
        Done
      </button>
    </div>
  );
}
