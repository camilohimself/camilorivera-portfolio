// Portfolio Gallery - Camilo Rivera
// NUCLEAR MODE: All images, no fictitious titles

const paintingsData = [
    { id: 1, technique: "Huile sur toile", image: "images/paintings/painting-001.jpg" },
    { id: 2, technique: "Huile sur toile", image: "images/paintings/painting-002.jpg" },
    { id: 3, technique: "Huile sur toile", image: "images/paintings/painting-003.jpg" },
    { id: 4, technique: "Huile sur toile", image: "images/paintings/painting-005.jpg" },
    { id: 5, technique: "Huile sur toile", image: "images/paintings/painting-006.jpg" },
    { id: 6, technique: "Huile sur toile", image: "images/paintings/painting-007.jpg" },
    { id: 7, technique: "Huile sur toile", image: "images/paintings/painting-008.jpg" },
    { id: 8, technique: "Huile sur toile", image: "images/paintings/painting-009.jpg" },
    { id: 9, technique: "Huile sur toile", image: "images/paintings/painting-010.jpg" },
    { id: 10, technique: "Huile sur toile", image: "images/paintings/painting-011.jpg" },
    { id: 11, technique: "Huile sur toile", image: "images/paintings/painting-012.jpg" },
    { id: 12, technique: "Huile sur toile", image: "images/paintings/painting-013.jpg" },
    { id: 13, technique: "Huile sur toile", image: "images/paintings/painting-014.jpg" },
    { id: 14, technique: "Huile sur toile", image: "images/paintings/painting-015.jpg" },
    { id: 15, technique: "Huile sur toile", image: "images/paintings/painting-016.jpg" },
    { id: 16, technique: "Huile sur toile", image: "images/paintings/painting-017.jpg" },
    { id: 17, technique: "Huile sur toile", image: "images/paintings/painting-018.jpg" },
    { id: 18, technique: "Huile sur toile", image: "images/paintings/painting-019.jpg" },
    { id: 19, technique: "Huile sur toile", image: "images/paintings/painting-020.jpg" },
    { id: 20, technique: "Huile sur toile", image: "images/paintings/painting-021.jpg" },
    { id: 21, technique: "Huile sur toile", image: "images/paintings/painting-022.jpg" },
    { id: 22, technique: "Huile sur toile", image: "images/paintings/painting-023.jpg" },
    { id: 23, technique: "Huile sur toile", image: "images/paintings/painting-024.jpg" },
    { id: 24, technique: "Huile sur toile", image: "images/paintings/painting-025.jpg" }
];

const shootingData = [
    { id: 1, technique: "Shooting Atelier", image: "images/shooting/IMG_4316-2-opt.jpg" },
    { id: 2, technique: "Shooting Atelier", image: "images/shooting/IMG_4316-opt.jpg" },
    { id: 3, technique: "Shooting Atelier", image: "images/shooting/IMG_4317-opt.jpg" },
    { id: 4, technique: "Shooting Atelier", image: "images/shooting/IMG_4318-opt.jpg" },
    { id: 5, technique: "Shooting Atelier", image: "images/shooting/IMG_4331 (1)-opt.jpg" },
    { id: 6, technique: "Shooting Atelier", image: "images/shooting/IMG_4331-opt.jpg" },
    { id: 7, technique: "Shooting Atelier", image: "images/shooting/IMG_4333-opt.jpg" },
    { id: 8, technique: "Shooting Atelier", image: "images/shooting/IMG_4335-opt.jpg" },
    { id: 9, technique: "Shooting Atelier", image: "images/shooting/IMG_4341-opt.jpg" },
    { id: 10, technique: "Shooting Atelier", image: "images/shooting/IMG_4344-opt.jpg" },
    { id: 11, technique: "Shooting Atelier", image: "images/shooting/IMG_4347-opt.jpg" },
    { id: 12, technique: "Shooting Atelier", image: "images/shooting/IMG_4350-opt.jpg" },
    { id: 13, technique: "Shooting Atelier", image: "images/shooting/IMG_4351 2-opt.jpg" },
    { id: 14, technique: "Shooting Atelier", image: "images/shooting/IMG_4351-opt.jpg" },
    { id: 15, technique: "Shooting Atelier", image: "images/shooting/IMG_4360 2-opt.jpg" },
    { id: 16, technique: "Shooting Atelier", image: "images/shooting/IMG_4360-opt.jpg" },
    { id: 17, technique: "Shooting Atelier", image: "images/shooting/IMG_4362-opt.jpg" },
    { id: 18, technique: "Shooting Atelier", image: "images/shooting/IMG_4367-opt.jpg" },
    { id: 19, technique: "Shooting Atelier", image: "images/shooting/IMG_4371-opt.jpg" },
    { id: 20, technique: "Shooting Atelier", image: "images/shooting/IMG_4376-opt.jpg" },
    { id: 21, technique: "Shooting Atelier", image: "images/shooting/IMG_4377-opt.jpg" },
    { id: 22, technique: "Shooting Atelier", image: "images/shooting/IMG_4391-opt.jpg" },
    { id: 23, technique: "Shooting Atelier", image: "images/shooting/IMG_4396-opt.jpg" },
    { id: 24, technique: "Shooting Atelier", image: "images/shooting/IMG_4400 (1)-opt.jpg" },
    { id: 25, technique: "Shooting Atelier", image: "images/shooting/IMG_4400-opt.jpg" },
    { id: 26, technique: "Shooting Atelier", image: "images/shooting/IMG_4405-opt.jpg" },
    { id: 27, technique: "Shooting Atelier", image: "images/shooting/IMG_4413-opt.jpg" },
    { id: 28, technique: "Shooting Atelier", image: "images/shooting/IMG_4414-opt.jpg" },
    { id: 29, technique: "Shooting Atelier", image: "images/shooting/IMG_4419-opt.jpg" },
    { id: 30, technique: "Shooting Atelier", image: "images/shooting/IMG_4420-opt.jpg" },
    { id: 31, technique: "Shooting Atelier", image: "images/shooting/IMG_4421-opt.jpg" },
    { id: 32, technique: "Shooting Atelier", image: "images/shooting/IMG_4423-opt.jpg" },
    { id: 33, technique: "Shooting Atelier", image: "images/shooting/IMG_4425-opt.jpg" },
    { id: 34, technique: "Shooting Atelier", image: "images/shooting/IMG_4428-opt.jpg" },
    { id: 35, technique: "Shooting Atelier", image: "images/shooting/IMG_4430-opt.jpg" },
    { id: 36, technique: "Shooting Atelier", image: "images/shooting/IMG_4433-opt.jpg" },
    { id: 37, technique: "Shooting Atelier", image: "images/shooting/IMG_4434-opt.jpg" },
    { id: 38, technique: "Shooting Atelier", image: "images/shooting/IMG_4435-opt.jpg" },
    { id: 39, technique: "Shooting Atelier", image: "images/shooting/IMG_4441-opt.jpg" },
    { id: 40, technique: "Shooting Atelier", image: "images/shooting/IMG_4443-opt.jpg" },
    { id: 41, technique: "Shooting Atelier", image: "images/shooting/IMG_4447-opt.jpg" },
    { id: 42, technique: "Shooting Atelier", image: "images/shooting/IMG_4449-opt.jpg" },
    { id: 43, technique: "Shooting Atelier", image: "images/shooting/IMG_4452-opt.jpg" },
    { id: 44, technique: "Shooting Atelier", image: "images/shooting/IMG_4454-opt.jpg" },
    { id: 45, technique: "Shooting Atelier", image: "images/shooting/IMG_4459-opt.jpg" },
    { id: 46, technique: "Shooting Atelier", image: "images/shooting/IMG_4464-opt.jpg" },
    { id: 47, technique: "Shooting Atelier", image: "images/shooting/IMG_4465-opt.jpg" },
    { id: 48, technique: "Shooting Atelier", image: "images/shooting/IMG_4472-opt.jpg" },
    { id: 49, technique: "Shooting Atelier", image: "images/shooting/IMG_4477-opt.jpg" },
    { id: 50, technique: "Shooting Atelier", image: "images/shooting/IMG_4480-opt.jpg" },
    { id: 51, technique: "Shooting Atelier", image: "images/shooting/IMG_4482-opt.jpg" },
    { id: 52, technique: "Shooting Atelier", image: "images/shooting/IMG_4488-opt.jpg" },
    { id: 53, technique: "Shooting Atelier", image: "images/shooting/IMG_4489-opt.jpg" },
    { id: 54, technique: "Shooting Atelier", image: "images/shooting/IMG_4490-opt.jpg" },
    { id: 55, technique: "Shooting Atelier", image: "images/shooting/IMG_4496-opt.jpg" },
    { id: 56, technique: "Shooting Atelier", image: "images/shooting/IMG_4503-opt.jpg" },
    { id: 57, technique: "Shooting Atelier", image: "images/shooting/IMG_4519-opt.jpg" },
    { id: 58, technique: "Shooting Atelier", image: "images/shooting/IMG_4526-opt.jpg" },
    { id: 59, technique: "Shooting Atelier", image: "images/shooting/IMG_4547-opt.jpg" },
    { id: 60, technique: "Shooting Atelier", image: "images/shooting/IMG_4550-opt.jpg" },
    { id: 61, technique: "Shooting Atelier", image: "images/shooting/IMG_4613-opt.jpg" },
    { id: 62, technique: "Shooting Atelier", image: "images/shooting/IMG_4615-opt.jpg" },
    { id: 63, technique: "Shooting Atelier", image: "images/shooting/IMG_4633-opt.jpg" },
    { id: 64, technique: "Shooting Atelier", image: "images/shooting/IMG_4670-opt.jpg" }
];

const encresData = [
    { id: 1, technique: "Encre de Chine", image: "images/encres/encre-020.jpg" },
    { id: 2, technique: "Encre de Chine", image: "images/encres/encre-021.jpg" },
    { id: 3, technique: "Encre de Chine", image: "images/encres/encre-022.jpg" },
    { id: 4, technique: "Encre de Chine", image: "images/encres/encre-023.jpg" },
    { id: 5, technique: "Encre de Chine", image: "images/encres/encre-024.jpg" },
    { id: 6, technique: "Encre de Chine", image: "images/encres/encre-025.jpg" },
    { id: 7, technique: "Encre de Chine", image: "images/encres/encre-026.jpg" },
    { id: 8, technique: "Encre de Chine", image: "images/encres/encre-027.jpg" },
    { id: 9, technique: "Encre de Chine", image: "images/encres/encre-028.jpg" },
    { id: 10, technique: "Encre de Chine", image: "images/encres/encre-029.jpg" },
    { id: 11, technique: "Encre de Chine", image: "images/encres/encre-030.jpg" },
    { id: 12, technique: "Encre de Chine", image: "images/encres/encre-031.jpg" },
    { id: 13, technique: "Encre de Chine", image: "images/encres/encre-032.jpg" },
    { id: 14, technique: "Encre de Chine", image: "images/encres/encre-033.jpg" },
    { id: 15, technique: "Encre de Chine", image: "images/encres/encre-034.jpg" },
    { id: 16, technique: "Encre de Chine", image: "images/encres/encre-035.jpg" },
    { id: 17, technique: "Encre de Chine", image: "images/encres/encre-036.jpg" },
    { id: 18, technique: "Encre de Chine", image: "images/encres/encre-037.jpg" },
    { id: 19, technique: "Encre de Chine", image: "images/encres/encre-038.jpg" },
    { id: 20, technique: "Encre de Chine", image: "images/encres/encre-039.jpg" },
    { id: 21, technique: "Encre de Chine", image: "images/encres/encre-040.jpg" },
    { id: 22, technique: "Encre de Chine", image: "images/encres/encre-041.jpg" },
    { id: 23, technique: "Encre de Chine", image: "images/encres/encre-042.jpg" },
    { id: 24, technique: "Encre de Chine", image: "images/encres/encre-043.jpg" },
    { id: 25, technique: "Encre de Chine", image: "images/encres/encre-044.jpg" },
    { id: 26, technique: "Encre de Chine", image: "images/encres/encre-045.jpg" },
    { id: 27, technique: "Encre de Chine", image: "images/encres/encre-046.jpg" },
    { id: 28, technique: "Encre de Chine", image: "images/encres/encre-047.jpg" },
    { id: 29, technique: "Encre de Chine", image: "images/encres/encre-048.jpg" },
    { id: 30, technique: "Encre de Chine", image: "images/encres/encre-049.jpg" },
    { id: 31, technique: "Encre de Chine", image: "images/encres/encre-050.jpg" }
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

        card.innerHTML = `
            <img src="${artwork.image}"
                 alt="Œuvre ${artwork.id}"
                 class="painting-image"
                 onerror="this.style.background='linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)'; this.style.display='block';"
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

// Load galleries when page loads
document.addEventListener('DOMContentLoaded', function() {
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