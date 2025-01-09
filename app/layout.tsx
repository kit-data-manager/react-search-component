import "@/index.css"

export const metadata = {
    title: "NEP Search",
    description: "Search for Fair Digital Objects"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
