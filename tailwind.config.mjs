/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: 'class', // Enable dark mode based on class toggle
	theme: {
	  extend: {
		colors: {
		  background: "var(--background)",
		  foreground: "var(--foreground)",
		},
	  },
	},
	plugins: [],
  };
  