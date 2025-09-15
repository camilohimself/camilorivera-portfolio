// Portfolio Gallery - Camilo Rivera
// Auto-generated from optimized images

const paintingsData = [
    { id: 1, title: "Abstraction Lyrique I", technique: "Huile sur toile", size: "80x100cm", price: "CHF 2,800", image: "images/paintings/painting-001.jpg" },
    { id: 2, title: "Réflexions Urbaines", technique: "Huile sur toile", size: "60x80cm", price: "CHF 2,200", image: "images/paintings/painting-002.jpg" },
    { id: 3, title: "Chaos Émotionnel", technique: "Huile sur toile", size: "100x120cm", price: "CHF 3,500", image: "images/paintings/painting-003.jpg" },
    { id: 4, title: "Fragments de Lumière", technique: "Huile sur toile", size: "50x70cm", price: "CHF 1,800", image: "images/paintings/painting-004.jpg" },
    { id: 5, title: "Mouvement Perpétuel", technique: "Huile sur toile", size: "70x90cm", price: "CHF 2,500", image: "images/paintings/painting-005.jpg" },
    { id: 6, title: "Éclats de Mémoire", technique: "Huile sur toile", size: "80x100cm", price: "CHF 2,800", image: "images/paintings/painting-006.jpg" },
    { id: 7, title: "Tempête Intérieure", technique: "Huile sur toile", size: "60x80cm", price: "CHF 2,200", image: "images/paintings/painting-007.jpg" },
    { id: 8, title: "Harmony of Chaos", technique: "Huile sur toile", size: "90x120cm", price: "CHF 3,200", image: "images/paintings/painting-008.jpg" },
    { id: 9, title: "Mélancolie Urbaine", technique: "Huile sur toile", size: "50x70cm", price: "CHF 1,800", image: "images/paintings/painting-009.jpg" },
    { id: 10, title: "Réverie Nocturne", technique: "Huile sur toile", size: "80x100cm", price: "CHF 2,800", image: "images/paintings/painting-010.jpg" },
    { id: 11, title: "Le Jaune", technique: "Huile sur toile", size: "70x90cm", price: "CHF 2,500", image: "images/paintings/painting-018.jpg" },
    { id: 12, title: "Berceau Bleu", technique: "Huile sur toile", size: "60x80cm", price: "CHF 2,200", image: "images/paintings/painting-019.jpg" }
];

const encresData = [
    { id: 1, title: "Fluidité I", technique: "Encre de Chine", size: "40x30cm", price: "CHF 800", image: "images/encres/encre-001.jpg" },
    { id: 2, title: "Équilibre Zen", technique: "Encre de Chine", size: "50x40cm", price: "CHF 900", image: "images/encres/encre-002.jpg" },
    { id: 3, title: "Méditation Liquide", technique: "Encre de Chine", size: "30x40cm", price: "CHF 700", image: "images/encres/encre-003.jpg" },
    { id: 4, title: "Souffle du Vent", technique: "Encre de Chine", size: "40x50cm", price: "CHF 850", image: "images/encres/encre-004.jpg" },
    { id: 5, title: "Clarté Contemplative", technique: "Encre de Chine", size: "35x45cm", price: "CHF 750", image: "images/encres/encre-005.jpg" },
    { id: 6, title: "Essence Primitive", technique: "Encre de Chine", size: "40x30cm", price: "CHF 800", image: "images/encres/encre-006.jpg" }
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
                 alt="${artwork.title}"
                 class="painting-image"
                 onerror="this.style.background='linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)'; this.style.display='block';"
                 loading="lazy">
            <div class="painting-overlay">
                <div class="painting-title">${artwork.title}</div>
                <div class="painting-details">${artwork.technique} • ${artwork.size}</div>
                <div class="painting-price">${artwork.price}</div>
            </div>
        `;

        // Click handler for artwork details
        card.addEventListener('click', () => {
            showArtworkDetails(artwork);
        });

        container.appendChild(card);
    });
}

function showArtworkDetails(artwork) {
    // Simple modal or contact form
    const message = `Bonjour,

Je suis intéressé(e) par l'œuvre "${artwork.title}" (${artwork.technique}, ${artwork.size}) exposée à Riddes.

Pourriez-vous me donner plus d'informations sur cette pièce?

Merci,`;

    const subject = `Exposition Riddes - ${artwork.title}`;
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