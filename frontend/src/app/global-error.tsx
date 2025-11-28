'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">We're experiencing some technical difficulties.</p>
            <div className="space-x-4">
              <button
                onClick={reset}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              <a 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}