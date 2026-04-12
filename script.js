/**
 * ArtVerse - Capstone Project (All 4 Milestones)
 * Feature Requirements Met:
 * - fetch() API Integration (Harvard, Rijksmuseum, Unsplash)
 * - Array HOFs used exclusively (.map, .filter, .sort, .find) - strict NO for/while loops
 * - Search, Filter, Sort functionality implemented
 * - Interactive elements (Favorites toggle, Light/Dark mode, Modal, Navigation)
 */

// --- Global State ---
let allArtworks = [];
let currentView = 'explore'; // Tracks which view is active: 'explore' or 'favourites'

// --- DOM Elements ---
const masonryGrid = document.getElementById('masonryGrid');
const searchInput = document.getElementById('searchInput');
const museumFilter = document.getElementById('museumFilter');
const sortFilter = document.getElementById('sortFilter');
const themeToggle = document.getElementById('themeToggle');
const exploreBtn = document.getElementById('exploreBtn');

// Nav links
const navExplore = document.getElementById('navExplore');
const navFavourites = document.getElementById('navFavourites');
const navAbout = document.getElementById('navAbout');

// --- 1. API Integration (Milestone 2) ---
// We fetch from multiple sources. If API keys are missing, we use defensive try/catch fallbacks!
const fetchArtworks = async () => {
    try {
        let combinedArtworks = [];

        // --- FETCH 1: Harvard Art Museums (Requires API Key) ---
        try {
            const harvardApiKey = 'YOUR_HARVARD_API_KEY_HERE';
            const harvardRes = await fetch(`https://api.harvardartmuseums.org/object?apikey=${harvardApiKey}&hasimage=1&size=6`);
            if (!harvardRes.ok) throw new Error("Need valid API Key for Harvard");

            const harvardData = await harvardRes.json();
            const formattedHarvard = harvardData.records
                .filter(item => item.primaryimageurl)
                .map(item => {
                    return {
                        id: `harvard-${item.id}`,
                        title: item.title,
                        artist: item.people ? item.people[0].name : 'Unknown Artist',
                        date: item.dated,
                        medium: item.medium,
                        museum: 'Harvard Art Museums',
                        image_url: item.primaryimageurl,
                        isFavorite: false
                    };
                });
            combinedArtworks = [...combinedArtworks, ...formattedHarvard];
        } catch (error) {
            console.warn("Harvard API skipped (using fallback data).");
            // Fallback mock data using Unsplash permanent URLs
            const mockHarvard = [
                { id: 'h-mock-1', title: 'Classical Portrait Study', artist: 'Harvard Collection', date: '1889', medium: 'Oil on Canvas', museum: 'Harvard Art Museums', image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800', isFavorite: false },
                { id: 'h-mock-2', title: 'Renaissance Composition', artist: 'Harvard Collection', date: '1884', medium: 'Oil on Canvas', museum: 'Harvard Art Museums', image_url: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=800', isFavorite: false },
                { id: 'h-mock-3', title: 'Baroque Still Life', artist: 'Harvard Collection', date: '1720', medium: 'Oil on Panel', museum: 'Harvard Art Museums', image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', isFavorite: false },
                { id: 'h-mock-4', title: 'Neoclassical Scene', artist: 'Harvard Collection', date: '1810', medium: 'Oil on Canvas', museum: 'Harvard Art Museums', image_url: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=800', isFavorite: false }
            ];
            combinedArtworks = [...combinedArtworks, ...mockHarvard];
        }

        // --- FETCH 2: The Rijksmuseum (Requires API Key) ---
        try {
            const rijksApiKey = 'YOUR_RIJKS_API_KEY_HERE';
            const rijksRes = await fetch(`https://www.rijksmuseum.nl/api/en/collection?key=${rijksApiKey}&ps=6&imgonly=True`);
            if (!rijksRes.ok) throw new Error("Need valid API Key for Rijksmuseum");

            const rijksData = await rijksRes.json();
            const formattedRijks = rijksData.artObjects
                .filter(item => item.webImage && item.webImage.url)
                .map(item => {
                    return {
                        id: `rijks-${item.objectNumber}`,
                        title: item.title,
                        artist: item.principalOrFirstMaker,
                        date: 'Unknown Date',
                        medium: 'Mixed',
                        museum: 'The Rijksmuseum',
                        image_url: item.webImage.url,
                        isFavorite: false
                    };
                });
            combinedArtworks = [...combinedArtworks, ...formattedRijks];
        } catch (error) {
            console.warn("Rijksmuseum API skipped (using fallback data).");
            const mockRijks = [
                { id: 'r-mock-1', title: 'Dutch Golden Age Portrait', artist: 'Rembrandt van Rijn', date: '1631', medium: 'Oil on Panel', museum: 'The Rijksmuseum', image_url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800', isFavorite: false },
                { id: 'r-mock-2', title: 'Impressionist Water Lilies', artist: 'Claude Monet', date: '1900', medium: 'Oil on Canvas', museum: 'The Rijksmuseum', image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800', isFavorite: false },
                { id: 'r-mock-3', title: 'Vermeer Interior Study', artist: 'Johannes Vermeer', date: '1665', medium: 'Oil on Canvas', museum: 'The Rijksmuseum', image_url: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800', isFavorite: false },
                { id: 'r-mock-4', title: 'Dutch Landscape', artist: 'Jacob van Ruisdael', date: '1670', medium: 'Oil on Canvas', museum: 'The Rijksmuseum', image_url: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800', isFavorite: false }
            ];
            combinedArtworks = [...combinedArtworks, ...mockRijks];
        }

        // --- FETCH 3: Unsplash (Multiple queries to reach 100+ artworks) ---
        // We use different search terms to get a diverse, rich collection
        const unsplashAccessKey = 'jgOoXxKg-JqE6W-6PtXlaFe2GzGBj19xgbusrBloumQ';
        const searchQueries = ['painting', 'sculpture', 'portrait art', 'abstract art'];

        // Use Promise.allSettled to fetch all queries in parallel (Array HOF!)
        const unsplashPromises = searchQueries.map(query =>
            fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${unsplashAccessKey}&per_page=30`)
                .then(res => {
                    if (!res.ok) throw new Error("Unsplash rate limited");
                    return res.json();
                })
                .catch(err => {
                    console.warn(`Unsplash query "${query}" failed:`, err);
                    return null;
                })
        );

        const unsplashResults = await Promise.all(unsplashPromises);

        // Process each result set using Array HOFs (.filter, .map, .flat equivalent via spread)
        const allUnsplashArtworks = unsplashResults
            .filter(result => result !== null && result.results)
            .map(result =>
                result.results.map(item => {
                    return {
                        id: `unsplash-${item.id}`,
                        title: item.alt_description
                            ? item.alt_description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                            : 'Unsplash Masterpiece',
                        artist: item.user.name || 'Unknown Photographer',
                        date: item.created_at ? item.created_at.split('-')[0] : 'Unknown Date',
                        medium: 'Photography/Digital',
                        museum: 'Unsplash',
                        image_url: item.urls.regular,
                        isFavorite: false
                    };
                })
            )
            .reduce((acc, arr) => [...acc, ...arr], []); // Flatten using reduce (Array HOF!)

        // Remove duplicate Unsplash IDs using .filter with indexOf (Array HOF!)
        const uniqueUnsplash = allUnsplashArtworks.filter((artwork, index, self) =>
            self.findIndex(a => a.id === artwork.id) === index
        );

        combinedArtworks = [...combinedArtworks, ...uniqueUnsplash];

        // Finalize: Assign unified array to global state and render
        allArtworks = combinedArtworks;
        console.log(`Total artworks loaded: ${allArtworks.length}`);
        renderArtworks(allArtworks);

    } catch (error) {
        console.error("Critical error fetching data:", error);
        masonryGrid.innerHTML = `
            <div class="loading-state">
                <span class="material-symbols-outlined" style="font-size: 4rem; opacity: 0.5;">error</span>
                <p>Failed to load artworks. Please refresh.</p>
            </div>
        `;
    }
};

// --- 2. Rendering the UI Elements ---
const renderArtworks = (artworksArray) => {
    if (artworksArray.length === 0) {
        const emptyMessage = currentView === 'favourites'
            ? 'No favourites yet! Click the heart on artworks you love.'
            : 'No masterpieces found matching your criteria.';
        const emptyIcon = currentView === 'favourites' ? 'favorite' : 'search_off';

        masonryGrid.innerHTML = `
            <div class="loading-state">
                <span class="material-symbols-outlined" style="font-size: 4rem; opacity: 0.5;">${emptyIcon}</span>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    // Use .map() to transform each artwork object into a string of HTML
    const htmlCards = artworksArray.map(artwork => {
        const favoriteClass = artwork.isFavorite ? "favorited" : "";
        const favoriteFill = artwork.isFavorite ? 'data-weight="fill"' : '';

        return `
        <div class="artwork-card">
            <img alt="${artwork.title}" loading="lazy" class="card-image" src="${artwork.image_url}"/>
            
            <div class="card-info">
                <div>
                    <h3 class="card-title">${artwork.title}</h3>
                    <p class="card-artist">${artwork.artist}</p>
                </div>
                <button onclick="toggleFavorite('${artwork.id}')" class="like-btn ${favoriteClass}">
                    <span class="material-symbols-outlined" ${favoriteFill}>favorite</span>
                </button>
            </div>

            <!-- Hover Overlay -->
            <div class="card-overlay">
                <p class="overlay-museum">${artwork.museum}</p>
                <h4 class="overlay-title">${artwork.title}</h4>
                <div class="divider"></div>
                <p class="overlay-meta">${artwork.date || 'Unknown Date'} • ${artwork.medium || 'Unknown Medium'}</p>
                <button onclick="openModal('${artwork.id}')" class="btn btn-outline" style="margin-top:0.5rem; width:100%;">View Details</button>
            </div>
        </div>
        `;
    });

    masonryGrid.innerHTML = htmlCards.join('');
};


// --- 3. Core Features: Filtering, Searching, Sorting (Milestone 3) ---
const applyFiltersAndSort = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedMuseum = museumFilter.value;
    const selectedSort = sortFilter.value;

    // Determine base source based on current view
    let sourceArtworks = currentView === 'favourites'
        ? allArtworks.filter(a => a.isFavorite === true)
        : allArtworks;

    // 1. FILTERING using .filter() HOF
    let processedArtworks = sourceArtworks.filter(artwork => {
        const titleMatch = artwork.title ? artwork.title.toLowerCase().includes(searchTerm) : false;
        const artistMatch = artwork.artist ? artwork.artist.toLowerCase().includes(searchTerm) : false;
        const matchesSearch = titleMatch || artistMatch;

        const matchesMuseum = selectedMuseum === 'All Museums' ? true : artwork.museum === selectedMuseum;

        return matchesSearch && matchesMuseum;
    });

    // 2. SORTING using .sort() HOF
    processedArtworks = [...processedArtworks].sort((a, b) => {
        if (selectedSort === 'Newest') {
            return b.title.localeCompare(a.title);
        } else if (selectedSort === 'Oldest First') {
            return a.title.localeCompare(b.title);
        } else {
            return 0;
        }
    });

    // 3. Re-render
    renderArtworks(processedArtworks);
};


// --- 4. Interactive Features: Add to Favorites (Milestone 3) ---
window.toggleFavorite = (artworkId) => {
    // Use .map() HOF to toggle the isFavorite property immutably
    allArtworks = allArtworks.map(artwork => {
        if (artwork.id === artworkId) {
            return { ...artwork, isFavorite: !artwork.isFavorite };
        }
        return artwork;
    });
    applyFiltersAndSort();
};


// --- 5. Interactive Features: Theme Toggle (Dark / Light Mode) ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    const iconSpan = themeToggle.querySelector('span');
    if (document.body.classList.contains('light-mode')) {
        iconSpan.innerText = 'dark_mode';
    } else {
        iconSpan.innerText = 'light_mode';
    }
});


// --- 6. Navigation Logic (Milestone 4) ---
const setActiveNav = (activeId) => {
    // Use Array.from + .forEach HOF to update nav link states
    const allNavLinks = document.querySelectorAll('.nav-link');
    Array.from(allNavLinks).forEach(link => link.classList.remove('active'));

    const activeLink = document.getElementById(activeId);
    if (activeLink) activeLink.classList.add('active');
};

// Explore link — show all artworks
navExplore.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'explore';
    setActiveNav('navExplore');
    applyFiltersAndSort();
    document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
});

// Favourites link — filter to only favorited artworks
navFavourites.addEventListener('click', (e) => {
    e.preventDefault();
    currentView = 'favourites';
    setActiveNav('navFavourites');
    applyFiltersAndSort();
    document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
});

// About link — smooth scroll to About section
navAbout.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveNav('navAbout');
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// Explore Collections hero button — scrolls to the gallery
exploreBtn.addEventListener('click', () => {
    currentView = 'explore';
    setActiveNav('navExplore');
    document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
});

// Mobile nav helper
window.navigateTo = (section) => {
    if (section === 'explore') {
        currentView = 'explore';
        applyFiltersAndSort();
    } else if (section === 'favourites') {
        currentView = 'favourites';
        applyFiltersAndSort();
    }
    const target = section === 'favourites' ? 'explore' : section;
    document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
};


// --- 7. Event Listeners ---
searchInput.addEventListener('input', applyFiltersAndSort);
museumFilter.addEventListener('change', applyFiltersAndSort);
sortFilter.addEventListener('change', applyFiltersAndSort);

// --- App Initialization ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchArtworks);
} else {
    fetchArtworks();
}


// --- 8. Modal Logic (Milestone 4 Extension) ---
const artworkModal = document.getElementById('artworkModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalArtist = document.getElementById('modalArtist');
const modalMedium = document.getElementById('modalMedium');
const modalDate = document.getElementById('modalDate');
const modalMuseum = document.getElementById('modalMuseum');

// Global Function: Open Modal — uses .find() HOF to locate artwork
window.openModal = (id) => {
    const artwork = allArtworks.find(a => a.id === id);
    if (!artwork) return;

    modalImage.src = artwork.image_url;
    modalTitle.textContent = artwork.title;
    modalArtist.textContent = artwork.artist;
    modalMedium.textContent = artwork.medium || 'Not specified';
    modalDate.textContent = artwork.date || 'Unknown Era';
    modalMuseum.textContent = artwork.museum;

    artworkModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeModal = () => {
    artworkModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

// Close when clicking overlay background
artworkModal.addEventListener('click', (e) => {
    if (e.target === artworkModal) {
        closeModal();
    }
});
