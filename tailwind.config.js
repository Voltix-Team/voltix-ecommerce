/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepCharcoal: "#1A1A1B",
        electricBlue: "#007BFF",
        silverMist: "#E2E8F0",
      },
    },
  },
  plugins: [],
}