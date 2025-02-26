import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ref, get } from "firebase/database";
import { database } from "../../firebase";

export default function ManagerProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [manager, setManager] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchManager = async () => {
      try {
        const infoRef = ref(database, "info");
        const snapshot = await get(infoRef);

        if (snapshot.exists()) {
          const companies = snapshot.val();
          let foundManager = null;

          for (const companyName in companies) {
            if (companies[companyName].managers && companies[companyName].managers[id]) {
              foundManager = {
                name: companies[companyName].managers[id].name,
                company: companyName,
              };
              break;
            }
          }

          if (foundManager) {
            setManager(foundManager);
          } else {
            setManager({ name: "Manager Not Found", company: "" });
          }
        } else {
          setManager({ name: "Manager Not Found", company: "" });
        }
      } catch (error) {
        console.error("Error fetching manager:", error);
      }
    };

    fetchManager();
  }, [id]);

  if (!manager) return <div>Loading...</div>;

  return (
    <div>
      <h1>Manager Profile</h1>
      <h2>Name: {manager.name}</h2>
      {manager.company && <h3>Company: {manager.company}</h3>}
    </div>
  );
}
