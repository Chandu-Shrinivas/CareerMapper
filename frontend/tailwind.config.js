/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			bg: '#F6FAF7',
  			'bg-deep': '#EEF6F0',
  			surface: '#FFFFFF',
  			ink: '#12211C',
  			'ink-soft': '#4B5D55',
  			'ink-faint': '#8A9C93',
  			line: '#DCE8E0',
  			emerald: {
  				DEFAULT: '#0E7A54',
  				deep: '#0A5A3E',
  				tint: '#E4F3EB'
  			},
  			mint: '#CFEFDE',
  			gap: {
  				DEFAULT: '#B8641A',
  				tint: '#FBEEE1'
  			},
  			violet: {
  				DEFAULT: '#6E4FA0',
  				tint: '#EFE9F7'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			success: {
  				DEFAULT: 'var(--success)',
  				foreground: '#FFFFFF'
  			},
  			warning: {
  				DEFAULT: 'var(--warning)',
  				foreground: '#12211C'
  			},
  			error: {
  				DEFAULT: 'var(--error)',
  				foreground: '#FFFFFF'
  			},
  			info: {
  				DEFAULT: 'var(--info)',
  				foreground: '#FFFFFF'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			display: [
  				'Plus Jakarta Sans',
  				'Fraunces',
  				'Georgia',
  				'serif'
  			],
  			sans: [
  				'Inter',
  				'IBM Plex Sans',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'IBM Plex Mono',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			card: '16px',
  			sm2: '10px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			soft: '0 1px 2px rgba(18,33,28,0.04), 0 8px 24px -12px rgba(18,33,28,0.12)',
  			card: '0 1px 1px rgba(18,33,28,0.04), 0 16px 40px -20px rgba(18,33,28,0.18)'
  		},
  		keyframes: {
  			fadeUp: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(14px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			fadeUp: 'fadeUp 0.6s ease forwards'
  		}
  	}
  },
  plugins: [],
}
