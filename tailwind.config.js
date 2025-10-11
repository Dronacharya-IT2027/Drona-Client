/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // adjust for your project
  ],
  theme: {
    extend: {
      fontFamily: {
        kodchasan: ['Kodchasan', 'sans-serif'],
      },
      colors: {
        primary: '#151313',   // 1st color
        secondary: '#ff5734', // 2nd color
        accent1: '#be94f5',   // 3rd color
        accent2: '#fccc42',   // 4th color
        background: '#f7f7f5',// 5th color
      },
    },
  },
  plugins: [],
}
