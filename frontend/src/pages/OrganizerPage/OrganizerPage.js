import { organizerApplicationComponent } from '../../components/OrganizerApplicationComponent.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (currentPath === '/api/organizer_view') {
        organizerApplicationComponent();
    }
});

