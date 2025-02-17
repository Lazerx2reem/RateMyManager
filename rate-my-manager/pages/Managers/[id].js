import { useRouter } from "next/router";

export default function ManagerProfile(props) {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manager Profile: {name}</h1>
      <p>Ratings and reviews will be displayed here.</p>
    </div>
  );
}

