// Portfolio Gallery - Camilo Rivera
// NUCLEAR MODE: All images, no fictitious titles

const paintingsData = [
    { id: 1, technique: "Huile sur toile", image: "images/paintings/2069C456-9AE8-4F5A-B35E-52B80A9605D2.webp" },
    { id: 2, technique: "Huile sur toile", image: "images/paintings/241240340_255290506453650_8691736928064111730_n.webp" },
    { id: 3, technique: "Huile sur toile", image: "images/paintings/245ED55B-2694-478D-AF2A-2391A61F5005.webp" },
    { id: 4, technique: "Huile sur toile", image: "images/paintings/4F9CB35A-F34A-4D53-B785-53F2C264A2CC 2.webp" },
    { id: 5, technique: "Huile sur toile", image: "images/paintings/5bdca9d5-f8be-4cba-bf45-aa0a8a393a49.webp" },
    { id: 6, technique: "Huile sur toile", image: "images/paintings/C02001B6-E7C4-4E98-8719-A72A5C222221.webp" },
    { id: 7, technique: "Huile sur toile", image: "images/paintings/DA381FB0-8774-4F18-A775-176A062AA833 2.webp" },
    { id: 8, technique: "Huile sur toile", image: "images/paintings/E69C2BAA-DDDB-4CAC-A621-FBBA68373234 3.webp" },
    { id: 9, technique: "Huile sur toile", image: "images/paintings/FA261FBD-CB95-427F-A772-0D0A9E998D9E 2.webp" },
    { id: 10, technique: "Huile sur toile", image: "images/paintings/IMG_0586.webp" },
    { id: 11, technique: "Huile sur toile", image: "images/paintings/IMG_0763.webp" },
    { id: 12, technique: "Huile sur toile", image: "images/paintings/IMG_0792 2.webp" },
    { id: 13, technique: "Huile sur toile", image: "images/paintings/IMG_0869 2.webp" },
    { id: 14, technique: "Huile sur toile", image: "images/paintings/IMG_4098.webp" },
    { id: 15, technique: "Huile sur toile", image: "images/paintings/IMG_4104.webp" },
    { id: 16, technique: "Huile sur toile", image: "images/paintings/IMG_5030.webp" },
    { id: 17, technique: "Huile sur toile", image: "images/paintings/IMG_5036.webp" },
    { id: 18, technique: "Huile sur toile", image: "images/paintings/IMG_5048.webp" },
    { id: 19, technique: "Huile sur toile", image: "images/paintings/berceau bleu.webp" },
    { id: 20, technique: "Huile sur toile", image: "images/paintings/lejaune.webp" }
];

const shootingData = [
    { id: 1, technique: "Shooting Atelier", image: "images/shooting/IMG_4316-2-opt.webp" },
    { id: 2, technique: "Shooting Atelier", image: "images/shooting/IMG_4316-opt.webp" },
    { id: 3, technique: "Shooting Atelier", image: "images/shooting/IMG_4317-opt.webp" },
    { id: 4, technique: "Shooting Atelier", image: "images/shooting/IMG_4318-opt.webp" },
    { id: 5, technique: "Shooting Atelier", image: "images/shooting/IMG_4331 (1)-opt.webp" },
    { id: 6, technique: "Shooting Atelier", image: "images/shooting/IMG_4331-opt.webp" },
    { id: 7, technique: "Shooting Atelier", image: "images/shooting/IMG_4333-opt.webp" },
    { id: 8, technique: "Shooting Atelier", image: "images/shooting/IMG_4335-opt.webp" },
    { id: 9, technique: "Shooting Atelier", image: "images/shooting/IMG_4341-opt.webp" },
    { id: 10, technique: "Shooting Atelier", image: "images/shooting/IMG_4344-opt.webp" },
    { id: 11, technique: "Shooting Atelier", image: "images/shooting/IMG_4347-opt.webp" },
    { id: 12, technique: "Shooting Atelier", image: "images/shooting/IMG_4350-opt.webp" },
    { id: 13, technique: "Shooting Atelier", image: "images/shooting/IMG_4351 2-opt.webp" },
    { id: 14, technique: "Shooting Atelier", image: "images/shooting/IMG_4351-opt.webp" },
    { id: 15, technique: "Shooting Atelier", image: "images/shooting/IMG_4360 2-opt.webp" },
    { id: 16, technique: "Shooting Atelier", image: "images/shooting/IMG_4360-opt.webp" },
    { id: 17, technique: "Shooting Atelier", image: "images/shooting/IMG_4362-opt.webp" },
    { id: 18, technique: "Shooting Atelier", image: "images/shooting/IMG_4367-opt.webp" },
    { id: 19, technique: "Shooting Atelier", image: "images/shooting/IMG_4371-opt.webp" },
    { id: 20, technique: "Shooting Atelier", image: "images/shooting/IMG_4376-opt.webp" },
    { id: 21, technique: "Shooting Atelier", image: "images/shooting/IMG_4377-opt.webp" },
    { id: 22, technique: "Shooting Atelier", image: "images/shooting/IMG_4391-opt.webp" },
    { id: 23, technique: "Shooting Atelier", image: "images/shooting/IMG_4396-opt.webp" },
    { id: 24, technique: "Shooting Atelier", image: "images/shooting/IMG_4400 (1)-opt.webp" },
    { id: 25, technique: "Shooting Atelier", image: "images/shooting/IMG_4400-opt.webp" },
    { id: 26, technique: "Shooting Atelier", image: "images/shooting/IMG_4405-opt.webp" },
    { id: 27, technique: "Shooting Atelier", image: "images/shooting/IMG_4413-opt.webp" },
    { id: 28, technique: "Shooting Atelier", image: "images/shooting/IMG_4414-opt.webp" },
    { id: 29, technique: "Shooting Atelier", image: "images/shooting/IMG_4419-opt.webp" },
    { id: 30, technique: "Shooting Atelier", image: "images/shooting/IMG_4420-opt.webp" },
    { id: 31, technique: "Shooting Atelier", image: "images/shooting/IMG_4421-opt.webp" },
    { id: 32, technique: "Shooting Atelier", image: "images/shooting/IMG_4423-opt.webp" },
    { id: 33, technique: "Shooting Atelier", image: "images/shooting/IMG_4425-opt.webp" },
    { id: 34, technique: "Shooting Atelier", image: "images/shooting/IMG_4428-opt.webp" },
    { id: 35, technique: "Shooting Atelier", image: "images/shooting/IMG_4430-opt.webp" },
    { id: 36, technique: "Shooting Atelier", image: "images/shooting/IMG_4433-opt.webp" },
    { id: 37, technique: "Shooting Atelier", image: "images/shooting/IMG_4434-opt.webp" },
    { id: 38, technique: "Shooting Atelier", image: "images/shooting/IMG_4435-opt.webp" },
    { id: 39, technique: "Shooting Atelier", image: "images/shooting/IMG_4441-opt.webp" },
    { id: 40, technique: "Shooting Atelier", image: "images/shooting/IMG_4443-opt.webp" },
    { id: 41, technique: "Shooting Atelier", image: "images/shooting/IMG_4447-opt.webp" },
    { id: 42, technique: "Shooting Atelier", image: "images/shooting/IMG_4449-opt.webp" },
    { id: 43, technique: "Shooting Atelier", image: "images/shooting/IMG_4452-opt.webp" },
    { id: 44, technique: "Shooting Atelier", image: "images/shooting/IMG_4454-opt.webp" },
    { id: 45, technique: "Shooting Atelier", image: "images/shooting/IMG_4459-opt.webp" },
    { id: 46, technique: "Shooting Atelier", image: "images/shooting/IMG_4464-opt.webp" },
    { id: 47, technique: "Shooting Atelier", image: "images/shooting/IMG_4465-opt.webp" },
    { id: 48, technique: "Shooting Atelier", image: "images/shooting/IMG_4472-opt.webp" },
    { id: 49, technique: "Shooting Atelier", image: "images/shooting/IMG_4477-opt.webp" },
    { id: 50, technique: "Shooting Atelier", image: "images/shooting/IMG_4480-opt.webp" },
    { id: 51, technique: "Shooting Atelier", image: "images/shooting/IMG_4482-opt.webp" },
    { id: 52, technique: "Shooting Atelier", image: "images/shooting/IMG_4488-opt.webp" },
    { id: 53, technique: "Shooting Atelier", image: "images/shooting/IMG_4489-opt.webp" },
    { id: 54, technique: "Shooting Atelier", image: "images/shooting/IMG_4490-opt.webp" },
    { id: 55, technique: "Shooting Atelier", image: "images/shooting/IMG_4496-opt.webp" },
    { id: 56, technique: "Shooting Atelier", image: "images/shooting/IMG_4503-opt.webp" },
    { id: 57, technique: "Shooting Atelier", image: "images/shooting/IMG_4519-opt.webp" },
    { id: 58, technique: "Shooting Atelier", image: "images/shooting/IMG_4526-opt.webp" },
    { id: 59, technique: "Shooting Atelier", image: "images/shooting/IMG_4547-opt.webp" },
    { id: 60, technique: "Shooting Atelier", image: "images/shooting/IMG_4550-opt.webp" },
    { id: 61, technique: "Shooting Atelier", image: "images/shooting/IMG_4613-opt.webp" },
    { id: 62, technique: "Shooting Atelier", image: "images/shooting/IMG_4615-opt.webp" },
    { id: 63, technique: "Shooting Atelier", image: "images/shooting/IMG_4633-opt.webp" },
    { id: 64, technique: "Shooting Atelier", image: "images/shooting/IMG_4670-opt.webp" }
];

const encresData = [
    { id: 1, technique: "Encre de Chine", image: "images/encres/1025E971-FC37-4284-B104-508562EF2D17.webp" },
    { id: 2, technique: "Encre de Chine", image: "images/encres/27216297-5A1A-44BA-8F04-DE41FB32E77E.webp" },
    { id: 3, technique: "Encre de Chine", image: "images/encres/3873A3C3-3FEA-4EA1-88DF-DD5DBED3DE54.webp" },
    { id: 4, technique: "Encre de Chine", image: "images/encres/3AF5264E-328A-4A24-BC65-4E7586AAF4D8.webp" },
    { id: 5, technique: "Encre de Chine", image: "images/encres/43150C4B-17AB-4B21-B5BF-28B02985BE81.webp" },
    { id: 6, technique: "Encre de Chine", image: "images/encres/7390EA9D-8440-4D5A-99CE-0F93E80098FA.webp" },
    { id: 7, technique: "Encre de Chine", image: "images/encres/82E94A6B-E49D-4430-91AC-94D596E18576.webp" },
    { id: 8, technique: "Encre de Chine", image: "images/encres/9B6F8B83-B5BF-41A0-98D7-19C864B8EC90.webp" },
    { id: 9, technique: "Encre de Chine", image: "images/encres/B6BB33BB-CF53-433E-ABF8-55C5E44F0B4B.webp" },
    { id: 10, technique: "Encre de Chine", image: "images/encres/B7B8FC71-48B0-413E-9C58-C8F7450D6E51.webp" },
    { id: 11, technique: "Encre de Chine", image: "images/encres/CEEBA166-0861-40C9-90C3-8B7714BA8143.webp" },
    { id: 12, technique: "Encre de Chine", image: "images/encres/DE67C11E-EA54-4B63-AF46-35AB65BC9A1E.webp" },
    { id: 13, technique: "Encre de Chine", image: "images/encres/IMG_1894.webp" },
    { id: 14, technique: "Encre de Chine", image: "images/encres/IMG_1963.webp" },
    { id: 15, technique: "Encre de Chine", image: "images/encres/IMG_2057.webp" },
    { id: 16, technique: "Encre de Chine", image: "images/encres/IMG_2161.webp" },
    { id: 17, technique: "Encre de Chine", image: "images/encres/IMG_3708.webp" },
    { id: 18, technique: "Encre de Chine", image: "images/encres/IMG_3710.webp" },
    { id: 19, technique: "Encre de Chine", image: "images/encres/IMG_3718.webp" },
    { id: 20, technique: "Encre de Chine", image: "images/encres/IMG_3727.webp" },
    { id: 21, technique: "Encre de Chine", image: "images/encres/IMG_3736.webp" },
    { id: 22, technique: "Encre de Chine", image: "images/encres/IMG_3737.webp" },
    { id: 23, technique: "Encre de Chine", image: "images/encres/IMG_3868 2.webp" },
    { id: 24, technique: "Encre de Chine", image: "images/encres/IMG_4810 2.webp" },
    { id: 25, technique: "Encre de Chine", image: "images/encres/IMG_4815.webp" },
    { id: 26, technique: "Encre de Chine", image: "images/encres/IMG_4936.webp" }
];

// Global variables for navigation
let currentGallery = [];
let currentIndex = 0;

function loadGallery(containerId, artworks) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    artworks.forEach((artwork, index) => {
        const card = document.createElement('div');
        card.className = 'painting-card';

        // CORRECTION CRITIQUE: Pas d'attributs onload/onerror qui cassent l'opacité
        card.innerHTML = `
            <img src="${artwork.image}"
                 alt="Œuvre ${artwork.id}"
                 class="painting-image"
                 loading="lazy">
            <div class="painting-overlay">
                <div class="painting-details">${artwork.technique}</div>
            </div>
        `;

        // Click handler for artwork enlargement
        card.addEventListener('click', () => {
            openLightbox(artwork, artworks, index);
        });

        container.appendChild(card);
    });
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

// Load galleries when page loads - VERSION SIMPLIFIÉE
document.addEventListener('DOMContentLoaded', function() {
    // Chargement direct sans timeout ni préchargement complexe
    loadGallery('paintings-grid', paintingsData);
    loadGallery('encres-grid', encresData);
    loadGallery('shooting-grid', shootingData);
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