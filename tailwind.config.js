export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        amber: { DEFAULT: '#E8622A' },
        paper: { DEFAULT: '#F9F7F3' },
        ink:   { DEFAULT: '#111111' },
        stone: { DEFAULT: '#888480' },
        chalk: { DEFAULT: '#E5E2DB' }
      }
    }
  },
  plugins: []
}
