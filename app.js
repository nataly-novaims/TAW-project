function renderEvents(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container)return;

    container.innerHTML = "";

    const eventsToShow = limit ? myEvents.slice(0,limit) : myEvents;

    container.innerHTML = eventsToShow.map(event => `
        <a href="event-details.html? id=${InputEvent.id}" class="event-card-link">
            <div class = "event-card">
                <h4>${event.title}</h4>
                <p>${event.date}<br>${event.location}</p>
            </div>
        </a>
    `).join('');
}






document.addEventListener('DOMContentLoaded', ()=> {
    renderEvents('main-events-container', 3);
    renderEvents('all-events-grid');
});