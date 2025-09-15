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

const encresData = [
    { id: 1, technique: "Encre de Chine", image: "images/encres/encre-000.jpg" },
    { id: 2, technique: "Encre de Chine", image: "images/encres/encre-001.jpg" },
    { id: 3, technique: "Encre de Chine", image: "images/encres/encre-002.jpg" },
    { id: 4, technique: "Encre de Chine", image: "images/encres/encre-004.jpg" },
    { id: 5, technique: "Encre de Chine", image: "images/encres/encre-005.jpg" },
    { id: 6, technique: "Encre de Chine", image: "images/encres/encre-006.jpg" },
    { id: 7, technique: "Encre de Chine", image: "images/encres/encre-007.jpg" },
    { id: 8, technique: "Encre de Chine", image: "images/encres/encre-008.jpg" },
    { id: 9, technique: "Encre de Chine", image: "images/encres/encre-009.jpg" },
    { id: 10, technique: "Encre de Chine", image: "images/encres/encre-010.jpg" },
    { id: 11, technique: "Encre de Chine", image: "images/encres/encre-011.jpg" },
    { id: 12, technique: "Encre de Chine", image: "images/encres/encre-012.jpg" },
    { id: 13, technique: "Encre de Chine", image: "images/encres/encre-013.jpg" },
    { id: 14, technique: "Encre de Chine", image: "images/encres/encre-014.jpg" },
    { id: 15, technique: "Encre de Chine", image: "images/encres/encre-015.jpg" },
    { id: 16, technique: "Encre de Chine", image: "images/encres/encre-016.jpg" },
    { id: 17, technique: "Encre de Chine", image: "images/encres/encre-017.jpg" },
    { id: 18, technique: "Encre de Chine", image: "images/encres/encre-018.jpg" },
    { id: 19, technique: "Encre de Chine", image: "images/encres/encre-019.jpg" },
    { id: 20, technique: "Encre de Chine", image: "images/encres/encre-020.jpg" },
    { id: 21, technique: "Encre de Chine", image: "images/encres/encre-021.jpg" },
    { id: 22, technique: "Encre de Chine", image: "images/encres/encre-022.jpg" },
    { id: 23, technique: "Encre de Chine", image: "images/encres/encre-023.jpg" },
    { id: 24, technique: "Encre de Chine", image: "images/encres/encre-024.jpg" },
    { id: 25, technique: "Encre de Chine", image: "images/encres/encre-025.jpg" },
    { id: 26, technique: "Encre de Chine", image: "images/encres/encre-026.jpg" }
];

function loadGallery(containerId, artworks) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    artworks.forEach(artwork => {
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
            openLightbox(artwork);
        });

        container.appendChild(card);
    });
}

function openLightbox(artwork) {
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
        </div>
    `;

    // Add lightbox to body
    document.body.appendChild(lightbox);

    // Close handlers
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    });

    // Escape key handler
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    });

    // Smooth entrance animation
    setTimeout(() => lightbox.classList.add('lightbox-active'), 10);
}

function closeLightbox(lightbox) {
    lightbox.classList.remove('lightbox-active');
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
});

// Export for potential future use
window.PortfolioGallery = {
    paintingsData,
    encresData,
    loadGallery,
    showArtworkDetails
};