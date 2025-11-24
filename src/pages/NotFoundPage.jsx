import { ScrollRestoration, useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <ScrollRestoration />
      <div className="max-w-2xl w-full text-center">
        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page went on a detox journey and never came back.
          Let's get you back to something refreshing!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#5a8120] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#b9c228] transition-all shadow-lg">
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border-2 border-[#5a8120] text-[#5a8120] px-8 py-3 rounded-lg font-medium hover:bg-[#5a8120] hover:text-white transition-all">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
