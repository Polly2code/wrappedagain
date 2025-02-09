
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#9b87f5',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#FFDEE2',
					foreground: '#1A1F2C'
				},
				accent: {
					DEFAULT: '#F97316',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#F1F0FB',
					foreground: '#1A1F2C'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
			},
			keyframes: {
				"fade-up": {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
				"fade-in": {
					"0%": {
						opacity: "0",
					},
					"100%": {
						opacity: "1",
					},
				},
				"marquee": {
					"0%": {
						transform: "translateX(100%)",
					},
					"100%": {
						transform: "translateX(-100%)",
					},
				},
			},
			animation: {
				"fade-up": "fade-up 0.5s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"marquee": "marquee 20s linear infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
