// Portfolio Gallery - Camilo Rivera - MODE DEBUG TOTAL
console.log('🚀 DÉMARRAGE GALLERY.JS - MODE DÉBOGAGE COMPLET');

// TEST SIMPLE - SEULEMENT 3 IMAGES POUR COMMENCER
const paintingsData = [
    { id: 1, technique: "Huile sur toile", image: "images/paintings/2069C456-9AE8-4F5A-B35E-52B80A9605D2.webp" },
    { id: 2, technique: "Huile sur toile", image: "images/paintings/241240340_255290506453650_8691736928064111730_n.webp" },
    { id: 3, technique: "Huile sur toile", image: "images/paintings/245ED55B-2694-478D-AF2A-2391A61F5005.webp" }
];

console.log('📊 PaintingsData défini:', paintingsData);

// TEST SIMPLE - SEULEMENT 2 IMAGES SHOOTING
const shootingData = [
    { id: 1, technique: "Shooting Atelier", image: "images/shooting/IMG_4316-2-opt.webp" },
    { id: 2, technique: "Shooting Atelier", image: "images/shooting/IMG_4613-opt.webp" }
];

console.log('📊 ShootingData défini:', shootingData);

// TEST SIMPLE - SEULEMENT 2 IMAGES ENCRES
const encresData = [
    { id: 1, technique: "Encre de Chine", image: "images/encres/1025E971-FC37-4284-B104-508562EF2D17.webp" },
    { id: 2, technique: "Encre de Chine", image: "images/encres/IMG_2161.webp" }
];

console.log('📊 EncresData défini:', encresData);

// Global variables for navigation
let currentGallery = [];
let currentIndex = 0;

function loadGallery(containerId, artworks) {
    console.log('🎨 DÉBUT loadGallery - Container:', containerId, 'Artworks:', artworks.length);

    const container = document.getElementById(containerId);
    if (!container) {
        console.error('❌ CONTAINER INTROUVABLE:', containerId);
        return;
    }

    console.log('✅ Container trouvé:', container);
    container.innerHTML = '';

    artworks.forEach((artwork, index) => {
        console.log(`🖼️ Création image ${index + 1}:`, artwork.image);

        const card = document.createElement('div');
        card.className = 'painting-card';
        card.style.background = '#f0f0f0'; // Fallback visible
        card.style.minHeight = '400px';

        // VERSION ULTRA-SIMPLE SANS COMPLEXITÉ
        card.innerHTML = `
            <img src="${artwork.image}"
                 alt="Œuvre ${artwork.id}"
                 class="painting-image"
                 style="width: 100%; height: 100%; object-fit: cover; opacity: 1;"
                 onload="console.log('✅ SUCCESS:', this.src);"
                 onerror="console.error('❌ FAILED:', this.src); this.style.background='red';">
            <div class="painting-overlay">
                <div class="painting-details">${artwork.technique}</div>
            </div>
        `;

        container.appendChild(card);
        console.log(`📦 Image ${index + 1} ajoutée au DOM`);
    });

    console.log('🏁 loadGallery TERMINÉ pour:', containerId);
}

function openLightbox(artwork, gallery, index) {
    // Set global variables for navigation
    currentGallery = gallery;
    currentIndex = index;

    // Remove any existing lightbox
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
        existingLightbox.remove();
    }

    // Create lightbox modal
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${artwork.image}" alt="Œuvre ${artwork.id}" class="lightbox-image">
            <div class="lightbox-info">
                <div class="lightbox-technique">${artwork.technique}</div>
                <button class="lightbox-contact" onclick="contactArtist('${artwork.technique}')">
                    Demander des informations
                </button>
            </div>
            <button class="lightbox-close">&times;</button>
            ${gallery.length > 1 ? `
                <button class="lightbox-nav lightbox-prev" data-direction="prev">‹</button>
                <button class="lightbox-nav lightbox-next" data-direction="next">›</button>
            ` : ''}
        </div>
    `;

    // Add lightbox to body
    document.body.appendChild(lightbox);

    // Navigation handlers
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('prev');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox('next');
        });
    }

    // Close handlers
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    });

    // Enhanced keyboard handlers
    document.addEventListener('keydown', function keyHandler(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox(lightbox);
                document.removeEventListener('keydown', keyHandler);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateLightbox('next');
                break;
        }
    });

    // Store keyboard handler for cleanup
    lightbox.keyHandler = function keyHandler(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox(lightbox);
                document.removeEventListener('keydown', keyHandler);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateLightbox('next');
                break;
        }
    };

    document.addEventListener('keydown', lightbox.keyHandler);

    // Smooth entrance animation
    setTimeout(() => lightbox.classList.add('lightbox-active'), 10);
}

function navigateLightbox(direction) {
    if (currentGallery.length <= 1) return;

    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % currentGallery.length;
    } else {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    }

    const newArtwork = currentGallery[currentIndex];
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTechnique = document.querySelector('.lightbox-technique');

    if (lightboxImage && lightboxTechnique) {
        // Smooth transition effect
        lightboxImage.style.opacity = '0.5';
        lightboxImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            lightboxImage.src = newArtwork.image;
            lightboxImage.alt = `Œuvre ${newArtwork.id}`;
            lightboxTechnique.textContent = newArtwork.technique;

            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 150);
    }
}

function closeLightbox(lightbox) {
    lightbox.classList.remove('lightbox-active');

    // Remove keyboard handler
    if (lightbox.keyHandler) {
        document.removeEventListener('keydown', lightbox.keyHandler);
    }

    setTimeout(() => {
        if (lightbox && lightbox.parentNode) {
            lightbox.parentNode.removeChild(lightbox);
        }
    }, 300);
}

function contactArtist(technique) {
    const message = `Bonjour,

Je suis intéressé(e) par une œuvre (${technique}) exposée à Riddes.

Pourriez-vous me donner plus d'informations sur cette pièce?

Merci,`;

    const subject = `Exposition Riddes - Œuvre ${technique}`;
    const mailtoLink = `mailto:camilo@osomcreative.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoLink;
}

// Précharger les images critiques
function preloadImages(artworks, limit = 6) {
    console.log(`🚀 Préchargement de ${Math.min(limit, artworks.length)} images...`);

    artworks.slice(0, limit).forEach((artwork, index) => {
        const img = new Image();
        img.onload = () => console.log(`✅ Image ${index + 1} préchargée:`, artwork.image);
        img.onerror = () => console.error(`❌ Erreur préchargement:`, artwork.image);
        img.src = artwork.image;
    });
}

// VERSION DEBUG ULTRA-SIMPLE
console.log('🚀 ATTENTE DU DOM...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM PRÊT - Début chargement galeries');

    // Test direct immédiat - PAS de timeout, PAS de préchargement
    console.log('📋 Chargement IMMÉDIAT des galeries...');

    loadGallery('paintings-grid', paintingsData);
    loadGallery('encres-grid', encresData);
    loadGallery('shooting-grid', shootingData);

    console.log('🏁 CHARGEMENT TERMINÉ');
});

// Export for potential future use
window.PortfolioGallery = {
    paintingsData,
    encresData,
    shootingData,
    loadGallery,
    openLightbox,
    navigateLightbox
};