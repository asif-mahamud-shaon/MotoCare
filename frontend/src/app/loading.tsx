export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="w-8 h-8 bg-primary-600 rounded-full absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading MotoCare</h2>
        <p className="text-gray-600">Please wait while we prepare your experience...</p>
      </div>
    </div>
  );
}
