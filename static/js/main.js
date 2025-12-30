import { APIService } from './api.js';
import { UI } from './ui.js';

// Main App Logic
document.addEventListener('DOMContentLoaded', () => {
    loadApp();
});

async function loadApp() {
    // 1. Load APOD
    try {
        UI.showLoading('apod-container');
        const apodData = await APIService.getAPOD();
        UI.renderAPOD(apodData);
    } catch (error) {
        console.error(error);
        document.getElementById('apod-container').innerHTML = '<p class="text-red-500 text-center">Gagal memuat APOD.</p>';
    }

    // 2. Load EPIC
    try {
        UI.showLoading('epic-container');
        const epicData = await APIService.getEPIC();
        UI.renderEPIC(epicData);
    } catch (error) {
        console.error(error);
    }

    // 3. Load Asteroids
    try {
        UI.showLoading('asteroid-container');
        const asteroidData = await APIService.getAsteroids();
        UI.renderAsteroids(asteroidData);
    } catch (error) {
        console.error(error);
    }
}
