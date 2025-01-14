export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to StreetEats</h1>
      <p className="text-gray-600 mt-4">Please sign in or sign up to continue.</p>
      <div className="mt-6 space-x-4">
        <a href="/signin" className="px-6 py-2 bg-blue-500 text-white rounded">
          Sign In
        </a>
        <a href="/signup" className="px-6 py-2 bg-green-500 text-white rounded">
          Sign Up
        </a>
      </div>
    </div>
  );
}
