import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', ...fontFamily.sans],
        body: ['var(--font-body)', ...fontFamily.sans]
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(210, 50%, 15%)', // Color primario
          foreground: 'hsl(210, 50%, 95%)' // Texto sobre fondo primario
        },
        secondary: {
          DEFAULT: 'hsl(210, 15%, 90%)', // Gris suave cercano al blanco para un mejor contraste
          foreground: 'hsl(210, 15%, 20%)' // Texto oscuro para contraste
        },
        destructive: {
          DEFAULT: 'hsl(348, 83%, 47%)', // Rojo vivo
          foreground: 'hsl(348, 83%, 95%)' // Texto claro sobre fondo destructivo
        },
        muted: {
          DEFAULT: 'hsl(210, 16%, 82%)', // Gris claro para elementos secundarios
          foreground: 'hsl(210, 16%, 20%)' // Texto oscuro
        },
        accent: {
          DEFAULT: 'hsl(171, 66%, 44%)', // Verde azulado brillante
          foreground: 'hsl(171, 66%, 95%)' // Texto claro sobre fondo de acento
        },
        popover: {
          DEFAULT: 'hsl(240, 5%, 15%)', // Un color oscuro para popovers
          foreground: 'hsl(240, 5%, 95%)' // Texto claro
        },
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)', // Blanco puro para tarjetas
          foreground: 'hsl(0, 0%, 20%)' // Texto oscuro
        },
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      zIndex: {
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
