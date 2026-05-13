function renderEvents(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container)return;

    const isEventsPage = window.location.pathname.includes('events.html');

    container.innerHTML = "";

    const eventsToShow = limit ? myEvents.slice(0,limit) : myEvents;

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



document.addEventListener('DOMContentLoaded', ()=> {
    renderEvents('main-events-container', 3);
    renderEvents('all-events-grid');
});

