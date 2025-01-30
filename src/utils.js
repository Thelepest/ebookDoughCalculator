export async function getUserLanguage() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return data.country_code;
    } catch (error) {
        console.error("Errore nel recupero della lingua:", error);
        return "EN";
    }
}
