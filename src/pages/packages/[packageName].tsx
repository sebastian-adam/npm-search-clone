import { useRouter } from "next/router";

const PackageDetail = () => {
  const router = useRouter();
  const { packageName } = router.query;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Package Detail Page</h1>
      <p>Package Name: {packageName}</p>
      {/* Fetch and display more details about the package */}
    </div>
  );
};

export default PackageDetail;
