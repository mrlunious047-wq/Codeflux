module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff88',
        'neon-green-dark': '#00cc6a',
        'cyber-black': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
        'glass': 'rgba(255, 255, 255, 0.05)'
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Space Grotesk', 'sans-serif']
      },
      animation: {
        'liquid': 'liquid 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        liquid: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' }
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 136, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    },
  },
  plugins: [],
}
