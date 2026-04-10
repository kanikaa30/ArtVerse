console.log("Milestone 2: Testing fetch connection...");
const fetchArtworks = async () => {
    try {
        let combinedArtworks = [];
        const harvardApiKey = 'YOUR_HARVARD_API_KEY_HERE'; 
        const harvardRes = await fetch(`https://api.harvardartmuseums.org/object?apikey=${harvardApiKey}&hasimage=1&size=6`);
        console.log(await harvardRes.json());
    } catch(err) {
        console.error("API error!");
    }
};
document.addEventListener("DOMContentLoaded", fetchArtworks);
