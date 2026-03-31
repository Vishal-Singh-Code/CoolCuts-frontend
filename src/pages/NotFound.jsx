import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg text-center bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
        <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex mt-6 px-5 py-3 rounded-2xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
