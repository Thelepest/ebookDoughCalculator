export async function getUserLanguage() {
    try {
        const stored = localStorage.getItem("appLang");
        if (stored) return stored;

        const browserLang = navigator?.language?.split("-")[0]?.toUpperCase();
        if (browserLang && ["EN", "IT", "PL"].includes(browserLang)) {
            return browserLang;
        }

        if (window.location.hostname === "localhost") {
            return "EN";
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);
        const response = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeout);
        if (!response.ok) {
            throw new Error("Failed to fetch location");
        }
        const data = await response.json();
        return data.country_code || "EN";
    } catch (error) {
        console.error("Errore nel recupero della lingua:", error);
        return "EN";
    }
}
