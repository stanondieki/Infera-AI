export function Logo() {
  return (
    <div className="flex items-center gap-4 group cursor-pointer select-none">
      <div className="relative">
        {/* Animated cosmic glow */}
        <div className="absolute -inset-3 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-indigo-600 rounded-[22px] blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
        
        {/* AI Particles - floating around the icon */}
        <div className="absolute -inset-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-1 h-1 bg-purple-400 rounded-full blur-[1px] animate-[float_3s_ease-in-out_infinite]"></div>
          <div className="absolute top-2 right-0 w-1.5 h-1.5 bg-fuchsia-400 rounded-full blur-[1px] animate-[float_4s_ease-in-out_infinite_0.5s]"></div>
          <div className="absolute bottom-0 left-2 w-1 h-1 bg-indigo-400 rounded-full blur-[1px] animate-[float_3.5s_ease-in-out_infinite_1s]"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-500 rounded-full blur-[1px] animate-[float_4.5s_ease-in-out_infinite_1.5s]"></div>
          <div className="absolute top-1/2 -left-4 w-1 h-1 bg-cyan-400 rounded-full blur-[1px] animate-[float_3.2s_ease-in-out_infinite_0.8s]"></div>
          <div className="absolute top-1/2 -right-4 w-1 h-1 bg-purple-400 rounded-full blur-[1px] animate-[float_3.8s_ease-in-out_infinite_1.2s]"></div>
        </div>
        
        {/* Circuit lines connecting particles - Neural network effect */}
        <div className="absolute -inset-8 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <line x1="20" y1="10" x2="50" y2="50" stroke="url(#gradient1)" strokeWidth="0.5" className="animate-[pulse_2s_ease-in-out_infinite]" />
            <line x1="80" y1="20" x2="50" y2="50" stroke="url(#gradient1)" strokeWidth="0.5" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
            <line x1="30" y1="90" x2="50" y2="50" stroke="url(#gradient1)" strokeWidth="0.5" className="animate-[pulse_2.2s_ease-in-out_infinite]" />
            <line x1="20" y1="55" x2="50" y2="50" stroke="url(#gradient2)" strokeWidth="0.5" className="animate-[pulse_2.8s_ease-in-out_infinite]" />
            <line x1="80" y1="55" x2="50" y2="50" stroke="url(#gradient2)" strokeWidth="0.5" className="animate-[pulse_3s_ease-in-out_infinite]" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Mid glow layer */}
        <div className="absolute -inset-1.5 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-600 rounded-[20px] blur-lg opacity-35 group-hover:opacity-55 group-hover:blur-xl transition-all duration-500"></div>
        
        {/* Main icon container with enhanced gradient */}
        <div className="relative w-[48px] h-[48px] rounded-[16px] bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-700 flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-500 ease-out overflow-hidden">
          {/* Hexagonal pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '12px 12px'
            }}></div>
          </div>
          
          {/* Glossy top shine */}
          <div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-white/40 via-white/5 to-transparent"></div>
          
          {/* Radial highlight */}
          <div className="absolute top-2 left-2 w-5 h-5 bg-white/30 rounded-full blur-lg"></div>
          
          {/* AI Scanning line */}
          <div className="absolute inset-0 rounded-[16px] overflow-hidden">
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
          </div>
          
          {/* Data particles inside icon */}
          <div className="absolute inset-0 overflow-hidden rounded-[16px]">
            <div className="absolute w-[2px] h-[2px] bg-cyan-300 rounded-full top-[20%] left-[30%] animate-[dataFlow_3s_ease-in-out_infinite] opacity-60"></div>
            <div className="absolute w-[2px] h-[2px] bg-purple-300 rounded-full top-[60%] left-[70%] animate-[dataFlow_2.5s_ease-in-out_infinite_0.5s] opacity-60"></div>
            <div className="absolute w-[2px] h-[2px] bg-fuchsia-300 rounded-full top-[40%] left-[50%] animate-[dataFlow_2.8s_ease-in-out_infinite_1s] opacity-60"></div>
          </div>
          
          {/* Bottom depth shadow */}
          <div className="absolute inset-0 rounded-[16px] bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          
          {/* Inner border glow */}
          <div className="absolute inset-[1px] rounded-[15px] border border-white/20"></div>
          
          {/* Checkmark icon - enhanced */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out"
          >
            <path
              d="M9 11L12 14L22 4"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
            <path
              d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex items-baseline -space-x-[1px] relative">
        {/* Text glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Neural pulse rings emanating from text */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3">
          <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
        </div>
        
        <span className="text-[36px] tracking-[-0.02em] text-gray-900 font-bold transition-all duration-300 group-hover:tracking-[-0.03em] group-hover:text-gray-950 relative">
          task
        </span>
        
        {/* Stylish animated hyphen with AI circuit */}
        <span className="relative inline-block mx-[2px] group/hyphen">
          <span className="text-[36px] tracking-[-0.02em] font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent animate-[pulse_2s_ease-in-out_infinite] group-hover:animate-none transition-all duration-300">
            -
          </span>
          {/* Hyphen glow with cyan accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          {/* Data stream through hyphen */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-[slideRight_1.5s_ease-in-out_infinite]"></div>
        </span>
        
        <span className="text-[36px] tracking-[-0.02em] font-bold transition-all duration-300 group-hover:tracking-[-0.03em] relative">
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:via-fuchsia-500 group-hover:to-indigo-500 animate-gradient bg-[length:200%_auto]">
            ify
          </span>
          {/* Text processing indicator */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex gap-1">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
            <div className="w-1 h-1 bg-fuchsia-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.4s]"></div>
          </div>
        </span>
      </div>
    </div>
  );
}

// Simple version for responsive/smaller screens
export function LogoSimple() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-700 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-2xl font-bold">
        <span className="text-gray-900">task</span>
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">-ify</span>
      </span>
    </div>
  );
}
