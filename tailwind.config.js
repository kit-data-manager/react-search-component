/** @type {import('tailwindcss').Config} */

import animatePlugin from "tailwindcss-animate"
import { isolateInsideOfContainer, scopedPreflightStyles } from "tailwindcss-scoped-preflight"

export default {
    darkMode: ["class", `[class="dark"]`],
    content: ["./src/**/*.{ts,tsx,js,jsx,css,mdx}"],
    prefix: "rfs-",
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--rfs-radius)",
                md: "calc(var(--rfs-radius) - 2px)",
                sm: "calc(var(--rfs-radius) - 4px)"
            },
            colors: {
                background: "hsl(var(--rfs-background))",
                foreground: "hsl(var(--rfs-foreground))",
                card: {
                    DEFAULT: "hsl(var(--rfs-card))",
                    foreground: "hsl(var(--rfs-card-foreground))"
                },
                popover: {
                    DEFAULT: "hsl(var(--rfs-popover))",
                    foreground: "hsl(var(--rfs-popover-foreground))"
                },
                primary: {
                    DEFAULT: "hsl(var(--rfs-primary))",
                    foreground: "hsl(var(--rfs-primary-foreground))"
                },
                secondary: {
                    DEFAULT: "hsl(var(--rfs-secondary))",
                    foreground: "hsl(var(--rfs-secondary-foreground))"
                },
                muted: {
                    DEFAULT: "hsl(var(--rfs-muted))",
                    foreground: "hsl(var(--rfs-muted-foreground))"
                },
                accent: {
                    DEFAULT: "hsl(var(--rfs-accent))",
                    foreground: "hsl(var(--rfs-accent-foreground))"
                },
                destructive: {
                    DEFAULT: "hsl(var(--rfs-destructive))",
                    foreground: "hsl(var(--rfs-destructive-foreground))"
                },
                border: "hsl(var(--rfs-border))",
                input: "hsl(var(--rfs-input))",
                ring: "hsl(var(--rfs-ring))",
                chart: {
                    1: "hsl(var(--rfs-chart-1))",
                    2: "hsl(var(--rfs-chart-2))",
                    3: "hsl(var(--rfs-chart-3))",
                    4: "hsl(var(--rfs-chart-4))",
                    5: "hsl(var(--rfs-chart-5))"
                }
            },
            keyframes: {
                "outline-ping": {
                    "0%, 100%": {
                        outline: "5px solid transparent"
                    },
                    "75%": {
                        outline: "5px solid hsl(var(--rfs-primary))"
                    }
                }
            },
            animation: {
                "rfs-outline-ping": "outline-ping 1s ease-in-out"
            }
        }
    },
    plugins: [
        animatePlugin,
        scopedPreflightStyles({
            isolationStrategy: isolateInsideOfContainer(".rfs-root", {})
        })
    ]
}
