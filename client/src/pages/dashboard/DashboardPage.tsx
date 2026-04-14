import { useUser, SignOutButton } from "@clerk/clerk-react";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard (Protected)</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <p className="text-gray-700">Welcome back, <strong>{user?.firstName || user?.username || "User"}</strong>!</p>
        <p className="text-gray-500 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
      </div>
      <SignOutButton>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}
