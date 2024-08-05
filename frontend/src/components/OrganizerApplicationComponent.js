import { fetchApplications } from '../pages/ViewPage/ViewPage.js';
import { filterApplicationComponent } from './FilterApplicationComponent.js';

function renderOrganizerView(applications) {

    const banner = document.getElementById('banner');
    if (banner) {
        banner.addEventListener('click', () => {
            navigateTo('/api/applicant_view');
        });
    } else {
        console.warn("Banner element not found");
    }

    const applicationsContainer = document.getElementById("organizerApplications");
    applicationsContainer.innerHTML = ""; // Clear existing content

    // Group applications by cuisine type
    const groupedApplications = groupByCuisineType(applications);

    Object.keys(groupedApplications).forEach(cuisineType => {
        const parentCard = document.createElement("div");
        parentCard.className = "card";
        parentCard.innerHTML = `
        <div class="card-body">
        <span class="arrow">&#9654;</span>
            <h4 class="card-title">${cuisineType}</h4>
            <div class="application-status">
                <span class="status-tag approved">Approved: ${countApplicationsByStatus(groupedApplications[cuisineType], 'Approved')}</span>
                <span class="status-tag pending">Pending: ${countApplicationsByStatus(groupedApplications[cuisineType], 'Pending')}</span>
                <span class="status-tag rejected">Rejected: ${countApplicationsByStatus(groupedApplications[cuisineType], 'Rejected')}</span>
            </div>
            
        </div>
            <div class="child-cards" style="display:none">
                ${generateChildCards(groupedApplications[cuisineType])}
            </div>
            
        `;
        applicationsContainer.appendChild(parentCard);

        parentCard.addEventListener('click', () => {
            const childCards = parentCard.querySelector('.child-cards');
            const arrow = parentCard.querySelector('.arrow');
            const isExpanded = childCards.style.display === 'block';
            childCards.style.display = isExpanded ? 'none' : 'block';
            arrow.innerHTML = isExpanded ? '&#9654;' : '&#9660;';
        });
    });
}

function countApplicationsByStatus(applications, status) {
    return applications.filter(app => app.status === status).length;
}

function navigateTo(url) {
    window.location.href = url;
}

function groupByCuisineType(applications) {
    return applications.reduce((acc, app) => {
        if (!acc[app.cuisine_type]) {
            acc[app.cuisine_type] = [];
        }
        acc[app.cuisine_type].push(app);
        return acc;
    }, {});
}

function generateChildCards(applications) {

    return applications.map(app => {
        let statusColor = '';
        if (app.status === 'Approved') {
            statusColor = '#c1ebae';
        } else if (app.status === 'Rejected') {
            statusColor = '#ab7e8e';
        } else if (app.status === 'Pending') {
            statusColor = '#9f8e9448';
        }

        return `
            <div class="child-card" style="background-color: ${statusColor}">
                <h5>Application Name: ${app.applicant_name}</h5>
                <p>ID: <a href="/api/organizer_manage?application_id=${app.application_id}" class="application-link" data-id="${app.application_id}">${app.application_id}</a></p>
                <p>Status: ${app.status}</p>
                <p>${app.status === 'Pending' ? `Venue Location: ${app.venue_location}` : `Allocated Location: ${app.allocated_location}`}</p>
            </div>
        `;
    }).join('');
}

export function organizerApplicationComponent() {
    filterApplicationComponent(true);
    fetchApplications()
        .then(data => {
            renderOrganizerView(data);
            document.querySelectorAll('.application-link').forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    const applicationId = link.getAttribute('data-id');
                    const application = data.find(app => app.application_id == applicationId);

                    if (application) {
                        if (application.status === 'Pending') {
                            navigateTo(`/api/organizer_manage?application_id=${applicationId}`);
                        } else if (application.status === 'Approved' || application.status === 'Rejected') {
                            navigateTo(`/api/organizer_final?application_id=${applicationId}`);
                        } else {
                            console.warn('Unhandled status:', application.status);
                        }
                    } else {
                        console.error('Application not found');
                    }
                });
            });
        })
        .catch(error => console.error("Error fetching applications:", error));
}
