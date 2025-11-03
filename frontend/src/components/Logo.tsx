import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function Logo({ className = '', variant = 'default', size = 'md', animated = true }: LogoProps) {
  const sizes = {
    sm: { container: 'h-8', text: 'text-lg', icon: 32 },
    md: { container: 'h-10', text: 'text-xl', icon: 40 },
    lg: { container: 'h-14', text: 'text-3xl', icon: 56 },
  };

  const colors = {
    default: {
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
      text: 'text-gray-900',
      glow: 'shadow-blue-500/50',
    },
    white: {
      gradient: 'from-white via-blue-100 to-purple-100',
      text: 'text-white',
      glow: 'shadow-white/50',
    },
    dark: {
      gradient: 'from-gray-800 via-gray-700 to-gray-900',
      text: 'text-gray-900',
      glow: 'shadow-gray-500/50',
    },
  };

  const sizeConfig = sizes[size];
  const colorConfig = colors[variant];

  return (
    <div className={`flex items-center gap-3 ${sizeConfig.container} ${className}`}>
      {/* Logo Icon */}
      <motion.div
        className="relative"
        animate={animated ? {
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-lg ${animated ? 'hover:drop-shadow-2xl transition-all' : ''}`}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="logoGradientGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer Circle with Glow */}
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
          />

          {/* Neural Network Pattern - Stylized "I" */}
          <g filter="url(#glow)">
            {/* Central Column - "I" */}
            <motion.rect
              x="44"
              y="25"
              width="12"
              height="50"
              rx="6"
              fill="url(#logoGradient)"
              animate={animated ? {
                scaleY: [1, 1.05, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Neural Nodes - Circles representing inference points */}
            {/* Top Node */}
            <motion.circle
              cx="50"
              cy="20"
              r="6"
              fill="url(#logoGradient)"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            />

            {/* Middle Nodes - Left and Right */}
            <motion.circle
              cx="30"
              cy="50"
              r="5"
              fill="url(#logoGradient)"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
            <motion.circle
              cx="70"
              cy="50"
              r="5"
              fill="url(#logoGradient)"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />

            {/* Bottom Node */}
            <motion.circle
              cx="50"
              cy="80"
              r="6"
              fill="url(#logoGradient)"
              animate={animated ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              }}
            />

            {/* Connection Lines - Neural Pathways */}
            <motion.line
              x1="50"
              y1="26"
              x2="30"
              y2="50"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              animate={animated ? {
                opacity: [0.4, 0.8, 0.4],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.line
              x1="50"
              y1="26"
              x2="70"
              y2="50"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              animate={animated ? {
                opacity: [0.4, 0.8, 0.4],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.line
              x1="50"
              y1="74"
              x2="30"
              y2="50"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              animate={animated ? {
                opacity: [0.4, 0.8, 0.4],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.25,
              }}
            />
            <motion.line
              x1="50"
              y1="74"
              x2="70"
              y2="50"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              animate={animated ? {
                opacity: [0.4, 0.8, 0.4],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.75,
              }}
            />
          </g>

          {/* Subtle particle effects around the logo */}
          {animated && (
            <>
              <motion.circle
                cx="20"
                cy="30"
                r="2"
                fill="#3b82f6"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="80"
                cy="70"
                r="2"
                fill="#ec4899"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </>
          )}
        </svg>
      </motion.div>

      {/* Logo Text */}
      <motion.div
        className="flex items-baseline gap-1"
        animate={animated ? {
          opacity: [1, 0.9, 1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className={`${sizeConfig.text} ${colorConfig.text} tracking-tight`}>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Infera
          </span>
        </span>
        <span className={`${sizeConfig.text} ${colorConfig.text} tracking-tight`}>AI</span>
      </motion.div>
    </div>
  );
}

// Simple version without animations for static use
export function LogoSimple({ className = '', size = 'md' }: Omit<LogoProps, 'animated' | 'variant'>) {
  return <Logo className={className} size={size} animated={false} />;
}
