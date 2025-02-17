import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Managers() {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    axios.get("/api/managers").then((response) => {
      setManagers(response.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Managers List</h1>
      <ul>
        {managers.map((manager) => (
          <li key={manager.id}>
            <Link href={`/managers/${manager.id}`}>
              <a className="text-blue-500">{manager.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
