import { useEffect } from "react"

export function useAutoDarkMode(dark?: boolean) {
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [dark])
}
