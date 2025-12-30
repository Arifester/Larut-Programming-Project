import { CONFIG } from './config.js';

export const UI = {
    // 1. Render APOD (Picture of the Day)
    renderAPOD(data) {
        const container = document.getElementById('apod-container');
        
        const mediaContent = data.media_type === 'video' 
            ? `<iframe class="w-full h-64 md:h-96 rounded-xl shadow-2xl border border-gray-700" src="${data.url}" allowfullscreen></iframe>`
            : `<img class="w-full rounded-xl shadow-2xl border border-gray-700 object-cover hover:scale-[1.01] transition duration-300" src="${data.url}" alt="${data.title}">`;

        container.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8 items-start">
                <div class="space-y-4">
                    <h2 class="text-3xl font-bold text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">${data.title}</h2>
                    <p class="text-gray-300 leading-relaxed text-sm md:text-base border-l-4 border-blue-500 pl-4">${data.explanation}</p>
                    <div class="flex items-center gap-3 mt-4">
                        <span class="bg-blue-900/50 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-500/30">${data.date}</span>
                        ${data.copyright ? `<span class="text-xs text-gray-500">© ${data.copyright}</span>` : ''}
                    </div>
                </div>
                <div class="w-full">
                    ${mediaContent}
                </div>
            </div>
        `;
    },

    // 2. Render EPIC (Earth Imagery)
    renderEPIC(dataList) {
        const container = document.getElementById('epic-container');
        const limitedData = dataList.slice(0, 6); 
        
        if (limitedData.length === 0) {
            this.renderError('epic-container', 'No Earth imagery data available for today.');
            return;
        }

        const cards = limitedData.map(item => {
            const dateParts = item.date.split(" ")[0].split("-"); 
            const imgDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
            const imgUrl = `${CONFIG.BASE_URL}/EPIC/archive/natural/${imgDate}/png/${item.image}.png?api_key=${CONFIG.API_KEY}`;

            return `
                <div class="group bg-gray-800/50 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500/50 transition duration-300">
                    <div class="overflow-hidden">
                        <img src="${imgUrl}" loading="lazy" class="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500" alt="EPIC Image">
                    </div>
                    <div class="p-4">
                        <p class="text-blue-300 text-xs font-mono mb-2">${item.date}</p>
                        <p class="text-gray-300 text-xs line-clamp-2" title="${item.caption}">${item.caption}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>`;
    },

    // 3. Render Asteroids (NeoWS)
    renderAsteroids(dataList) {
        const container = document.getElementById('asteroid-container');
        
        const sortedData = dataList.sort((a, b) => b.estimated_diameter.meters.estimated_diameter_max - a.estimated_diameter.meters.estimated_diameter_max);

        const cards = sortedData.map(item => {
            const isHazardous = item.is_potentially_hazardous_asteroid;
            const size = item.estimated_diameter.meters.estimated_diameter_max.toFixed(2);
            // Ubah format angka ke US (contoh: 1,200.50)
            const missDistance = parseFloat(item.close_approach_data[0].miss_distance.kilometers).toLocaleString('en-US');

            return `
                <div class="flex items-center justify-between p-4 rounded-lg border-l-4 bg-gray-800/40 hover:bg-gray-800 transition ${isHazardous ? 'border-red-500' : 'border-green-500'}">
                    <div>
                        <h4 class="font-bold text-gray-200">${item.name}</h4>
                        <p class="text-xs text-gray-500 mt-1">Distance: <span class="text-gray-300">${missDistance} km</span></p>
                    </div>
                    <div class="text-right">
                        <div class="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isHazardous ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}">
                            ${isHazardous ? 'HAZARDOUS' : 'SAFE'}
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Ø ${size} m</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="space-y-3">${cards}</div>`;
    },
    
    // 4. Helper: Loading State
    showLoading(elementId) {
        document.getElementById(elementId).innerHTML = `
            <div class="flex flex-col justify-center items-center p-12 animate-pulse space-y-3">
                <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-blue-400 font-mono text-sm tracking-widest">CONNECTING TO SATELLITE...</span>
            </div>`;
    },

    // 5. Helper: Error State
    renderError(elementId, message) {
        const container = document.getElementById(elementId);
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8 bg-gray-800/30 rounded-xl border border-red-500/20 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400 mb-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="text-md font-bold text-red-200">Connection Error</h3>
                <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">${message}</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition border border-gray-600">
                    Retry
                </button>
            </div>
        `;
    }
};
