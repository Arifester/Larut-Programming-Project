import { APIService } from './api.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    loadApp();
});

async function loadApp() {
    
    // --- 1. Load APOD ---
    try {
        UI.showLoading('apod-container');
        const apodData = await APIService.getAPOD();
        UI.renderAPOD(apodData);
    } catch (error) {
        console.error("APOD Error:", error);
        UI.renderError('apod-container', 'Failed to load Astronomy Picture of the Day. Please check your connection.');
    }

    // --- 2. Load EPIC ---
    try {
        UI.showLoading('epic-container');
        
        // Timeout 10s
        const epicPromise = APIService.getEPIC();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request Timeout')), 10000)
        );

        const epicData = await Promise.race([epicPromise, timeoutPromise]);
        
        UI.renderEPIC(epicData);

    } catch (error) {
        console.warn("EPIC Error:", error); 

        let msg = 'Failed to retrieve data from EPIC satellite.';
        
        if (error.message === 'Request Timeout') {
            msg = 'Connection to satellite timed out.';
        } else if (error.response && error.response.status === 503) {
            msg = 'NASA Server is currently overloaded (503 Service Unavailable). Please try again later.';
        } else if (error.response && error.response.status === 429) {
            msg = 'Too many requests (API Key Limit Exceeded).';
        }

        UI.renderError('epic-container', msg);
    }

    // --- 3. Load Asteroids ---
    try {
        UI.showLoading('asteroid-container');
        const asteroidData = await APIService.getAsteroids();
        UI.renderAsteroids(asteroidData);
    } catch (error) {
        console.error("Asteroid Error:", error);
        UI.renderError('asteroid-container', 'Failed to track near-Earth objects.');
    }
}
