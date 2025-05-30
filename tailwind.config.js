/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
  	extend:{
		colors:{
			"primary": "#787486",
			"secondary":"#F5F5F5",
      "secondary-2":"#dbdbdb",
      "dark":"#0D062D",
      "light-1":"#5030E5"
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
}

