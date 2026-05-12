import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center border border-gray-700 bg-[#1b1b1b] p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-[#FFC72C] mb-4">
          Page Not Found
        </h1>

        <p className="text-sm text-gray-300 mb-6">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block bg-[#C8102E] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a00d25]"
        >
          Return to Form
        </Link>
      </div>
    </div>
  );
}
