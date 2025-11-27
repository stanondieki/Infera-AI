// Favicon icon component - just the checkmark icon without text
export function FaviconIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
      {/* Glossy shine */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/40 via-white/5 to-transparent"></div>
      
      {/* Checkmark icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <path
          d="M9 11L12 14L22 4"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}