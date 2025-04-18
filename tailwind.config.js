/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
				},
				'blob': {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.5s ease-out',
				'shake': 'shake 0.5s ease-in-out',
				'blob': 'blob 7s infinite',
			},
			fontFamily: {
				sans: ["manrope", "system-ui"],
				serif: ["Arapey", "serif"],
			},
			colors: {
				dark: "#161A1B",
				light: "#4F5561",
				dark_red: "#260303",
				red: "#400606",
				off_white: "#F2F2F2",
				white: "#FFFFFF",
				gray: "#999999",
				dark_gray: "#444444",
				green: "rgb(20 83 45)",
			},
			borderRadius: {
				full: "999px",
				rsm: "5px",
				rmd: "10px",
				rlg: "15px",
			},
			backgroundImage: {},
		},
	},
	plugins: [],
};
