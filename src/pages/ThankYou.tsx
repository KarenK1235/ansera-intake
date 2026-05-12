import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center border border-[#C8102E] bg-[#1b1b1b] p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#FFC72C] mb-4">
          Thank You
        </h1>

        <p className="text-sm text-gray-200 mb-6">
          Your intake form has been received. Otto Growth Lab will review your information and follow up with next steps.
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
