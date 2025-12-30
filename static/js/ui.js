import { CONFIG } from './config.js';

export const UI = {
    // Render APOD
    renderAPOD(data) {
        const container = document.getElementById('apod-container');
        // Cek media type, karena APOD kadang video (youtube embed) bukan image
        const mediaContent = data.media_type === 'video' 
            ? `<iframe class="w-full h-64 md:h-96 rounded-lg shadow-lg" src="${data.url}" allowfullscreen></iframe>`
            : `<img class="w-full rounded-lg shadow-lg object-cover hover:scale-[1.01] transition duration-300" src="${data.url}" alt="${data.title}">`;

        container.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8 items-center">
                <div class="space-y-4">
                    <h2 class="text-3xl font-bold text-blue-400">${data.title}</h2>
                    <p class="text-gray-300 leading-relaxed">${data.explanation}</p>
                    <span class="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">${data.date}</span>
                </div>
                <div>
                    ${mediaContent}
                    <p class="text-center text-sm text-gray-500 mt-2">${data.copyright ? `© ${data.copyright}` : ''}</p>
                </div>
            </div>
        `;
    },

    // Render EPIC (Gallery Grid)
    renderEPIC(dataList) {
        const container = document.getElementById('epic-container');
        // Batasi cuma 6 gambar biar gak kepanjangan
        const limitedData = dataList.slice(0, 6); 
        
        const cards = limitedData.map(item => {
            const dateParts = item.date.split(" ")[0].split("-"); // YYYY-MM-DD
            const imgDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
            const imgUrl = `${CONFIG.BASE_URL}/EPIC/archive/natural/${imgDate}/png/${item.image}.png?api_key=${CONFIG.API_KEY}`;

            return `
                <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition">
                    <img src="${imgUrl}" loading="lazy" class="w-full h-48 object-cover" alt="EPIC Image">
                    <div class="p-4">
                        <p class="text-blue-300 text-sm mb-1">${item.date}</p>
                        <p class="text-gray-400 text-xs line-clamp-2">${item.caption}</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">${cards}</div>`;
    },

    // Render Asteroids (List Card)
    renderAsteroids(dataList) {
        const container = document.getElementById('asteroid-container');
        
        // Urutkan dari yang terbesar diameternya (opsional logic)
        const sortedData = dataList.sort((a, b) => b.estimated_diameter.meters.estimated_diameter_max - a.estimated_diameter.meters.estimated_diameter_max);

        const cards = sortedData.map(item => {
            const isHazardous = item.is_potentially_hazardous_asteroid;
            const size = item.estimated_diameter.meters.estimated_diameter_max.toFixed(2);
            const missDistance = parseFloat(item.close_approach_data[0].miss_distance.kilometers).toLocaleString('id-ID');

            return `
                <div class="flex items-center justify-between bg-gray-800 p-4 rounded-lg border-l-4 ${isHazardous ? 'border-red-500' : 'border-green-500'}">
                    <div>
                        <h4 class="font-bold text-lg text-gray-100">${item.name}</h4>
                        <p class="text-xs text-gray-400">Jarak: ${missDistance} km</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-bold ${isHazardous ? 'text-red-400' : 'text-green-400'}">
                            ${isHazardous ? 'Danger!' : 'Safe'}
                        </p>
                        <p class="text-xs text-gray-500">Ø ${size} m</p>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="space-y-3">${cards}</div>`;
    },
    
    // Loading State Helper
    showLoading(elementId) {
        document.getElementById(elementId).innerHTML = `
            <div class="flex justify-center p-10 animate-pulse">
                <span class="text-blue-400 font-mono">Scanning Deep Space...</span>
            </div>`;
    }
};
