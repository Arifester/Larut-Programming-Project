import { CONFIG } from './config.js';

// Helper untuk format tanggal YYYY-MM-DD
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

export const APIService = {
    // 1. Fetch Picture of the Day
    async getAPOD() {
        const url = `${CONFIG.BASE_URL}/planetary/apod?api_key=${CONFIG.API_KEY}`;
        const response = await axios.get(url);
        return response.data;
    },

    // 2. Fetch EPIC Images
    async getEPIC() {
        const url = `${CONFIG.BASE_URL}/EPIC/api/natural/images?api_key=${CONFIG.API_KEY}`;
        const response = await axios.get(url);
        return response.data; // Mengembalikan array
    },

    // 3. Fetch Asteroid (Dynamic Date!)
    async getAsteroids() {
        const today = getTodayDate();
        const url = `${CONFIG.BASE_URL}/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${CONFIG.API_KEY}`;
        const response = await axios.get(url);
        // Langsung kembalikan array object asteroid hari ini
        return response.data.near_earth_objects[today];
    }
};
