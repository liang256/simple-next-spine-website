import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Spine Animation Demo</h1>
      <p className="text-lg text-gray-600 mb-6">Choose a demo to view:</p>
      <div className="space-y-4">
        <Link href="/click-jump" className="block px-4 py-2 text-lg text-white bg-blue-500 hover:bg-blue-600 rounded shadow">
            Click-Jump Animation
        </Link>
        <Link href="/switch-animation" className="block px-4 py-2 text-lg text-white bg-green-500 hover:bg-green-600 rounded shadow">
            Switch-Animation Demo
        </Link>
      </div>
    </div>
  );
}
