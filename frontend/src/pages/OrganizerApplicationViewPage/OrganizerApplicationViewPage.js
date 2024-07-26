import { organizerApplicationViewComponent } from '../../components/OrganizerApplicationViewComponent.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backButton').addEventListener('click', () => {
        navigateTo('/api/organizer_view');
    });
    organizerApplicationViewComponent();
});

const banner = document.getElementById('banner');
if (banner) {
    banner.addEventListener('click', () => {
        navigateTo('/api/applicant_view');
    });
} else {
    console.warn("Banner element not found");
}

function navigateTo(url) {
    window.location.href = url;
}

export async function organizerFetchApplicationDetails(applicationId) {
    const response = await fetch(`/api/organizer_application/${applicationId}`);
    return await response.json();
}