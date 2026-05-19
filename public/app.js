 //Creation of some sample events
function renderEvents(containerId, limit = null, data = myEvents) {
    const container = document.getElementById(containerId);
    if (!container)return;

    const isEventsPage = window.location.pathname.includes('events.html');

    container.innerHTML = "";

    const eventsToShow = limit ? data.slice(0,limit) : data;

    eventsToShow.forEach(event => {
        const card = `
            <a href="event-details.html?id=${event.id}" class="event-card-link">
                <div class = "event-card">
                    <h4>${event.title}</h4>
                    <p class="category-tag">${event.category} </p>
                    <p>Date: ${event.date}<br>Location: ${event.location}</p>
                    ${isEventsPage ? `<p class="event-description">${event.description || ''}</p>` : ''}
                </div>
            </a>
        `;
        container.innerHTML += card;
    });

}

// Event details page logic
if (window.location.pathname.includes('event-details.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const event = myEvents.find(e => e.id === id);


    if (event) {
        document.getElementById('event-title').innerText = event.title;
        document.getElementById('event-date').innerText = `Date: ${event.date}`;
        document.getElementById('event-location').innerText = `Location: ${event.location}`;
        document.getElementById('event-description').innerText = `Description: ${event.description}`;
        document.getElementById('event-category').innerText = `Category: ${event.category}`;
        document.getElementById('event-organizer').innerText = `Organized by: ${event.organizer}`;
        document.getElementById('event-participants').innerText = `Participants: ${event.participants}`;

    }
}

// Events page filtering logic
// Only run this code if we're on the events page
if (window.location.pathname.includes('events.html')) {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');

    // Function to filter events based on search input and selected category
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        const filteredEvents = myEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                                  (event.description && event.description.toLowerCase().includes(searchTerm));

            const matchesCategory = selectedCategory === "all" || 
                                    event.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });

        renderEvents('all-events-grid', null, filteredEvents);
    }

    // Add event listeners for search input and category select
    searchInput.addEventListener('input', filterEvents);
    categorySelect.addEventListener('change', filterEvents);
}

// Initial rendering of events
document.addEventListener('DOMContentLoaded', ()=> {
    renderEvents('main-events-container', 3);
    renderEvents('all-events-grid');
});

