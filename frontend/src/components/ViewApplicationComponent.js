import { fetchApplications, fetchApplicationDetails, deleteApplication } from '../pages/ViewPage/ViewPage.js';
import { filterApplicationComponent } from './FilterApplicationComponent.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM fully loaded and parsed for View Page");
    viewApplicationComponent();
});

export function renderApplications(applications, showEditButtons, isSingleView) {
    const applicationsContainer = document.getElementById("applications");
    applicationsContainer.innerHTML = "";

    if (!Array.isArray(applications)) {
        applications = [applications];
    }

    applications.forEach(application => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = generateCardHTML(application, showEditButtons);
        applicationsContainer.appendChild(card);
    });

    if (isSingleView) {
        applicationsContainer.classList.add("centered-container");
    } else {
        applicationsContainer.classList.remove("centered-container");
    }

    setupEventListeners();
}

function generateCardHTML(application, showEditButtons) {
    const itemsHTML = (application.items || []).map(item => `
        <tr>
            <td>${item.item_name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
        </tr>
    `).join('');
    const editButtonHTML = showEditButtons
        ? `<button class="edit-button" data-id="${application.application_id}" ${application.status !== 'Pending' ? 'disabled' : ''}>Edit</button>`
        : '';

    return `
        <h5 class="card-title">Application Name: ${application.applicant_name}</h5>
        <p class="card-text">ID: <a href="#" class="application-link" data-id="${application.application_id}">${application.application_id}</a></p>
        <p class="card-text">Status: ${application.status}</p>
        <p class="card-text">Cuisine Type: ${application.cuisine_type || ''}</p>
        ${showEditButtons ? `
            <p class="card-text">Description: ${application.description || ''}</p>
            <p class="card-text">Phone: ${application.applicant_phone || ''}</p>
            <p class="card-text">Email: ${application.applicant_email || ''}</p>
            <p class="card-text">Created Date: ${application.created_date || ''}</p>
            <p class="card-text">Venue Location: ${application.venue_location || ''}</p>
            <p class="card-text">Allocated Location: ${application.allocated_location || ''}</p>
            <p class="card-text">Requester Comments: ${application.requester_comments || ''}</p>
                               <div class="items-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>
                </div>
            <p class="card-text">Total Price: $${parseFloat(application.total_price).toFixed(2)}</p> <!-- Display total price -->
                ` : ''}
        <div class="card-actions">
            ${editButtonHTML}
            <button class="btn btn-danger delete-button" data-id="${application.application_id}">Delete</button>
        </div>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
    `;
}

function setupEventListeners() {
    document.querySelectorAll('.application-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(`/api/applicant_view?application_id=${link.getAttribute('data-id')}`);
        });
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => {
            navigateTo(`/api/applicant_edit?application_id=${button.getAttribute('data-id')}`);
        });
    });

    document.querySelectorAll('.button-button').forEach(button => {
        button.addEventListener('click', () => {
            navigateTo(`/api/applicant_view`);
        });
    });

    const banner = document.getElementById('banner');
    if (banner) {
        banner.addEventListener('click', () => {
            navigateTo('/api/organizer_view');
        });
    } else {
        console.warn("Banner element not found");
    }

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            const applicationId = button.getAttribute('data-id');
            deleteApplication(applicationId).then(() => {
                navigateTo("/api/applicant_view");
            });
        });
    });

    const createButton = document.getElementById('createButton');
    if (createButton) {
        createButton.addEventListener('click', () => {
            navigateTo("/api/applicant_create");
        });
    }

    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            navigateTo('/api/applicant_view');
        });
    }
}

function navigateTo(url) {
    window.location.href = url;
}

export async function viewApplicationComponent() {
    await filterApplicationComponent(false);
    const createButton = document.getElementById("createButton");
    const applicationsDiv = document.getElementById("applications");
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('application_id');
    const backButton = document.getElementById('backButton');
    const filterButton = document.getElementById('filterButton');

    if (filterButton) {

        filterButton.addEventListener('click', (event) => {
            event.preventDefault();
            filterApplicationComponent(false, (data) => {
                if (data && data.results && data.results.length > 0) {
                    if (applicationsDiv) applicationsDiv.innerHTML = '';
                    renderApplications(data.results, false);
                } else {
                    console.error('No results found');
                    if (applicationsDiv) applicationsDiv.innerHTML = '<p>No results found.</p>';
                }
            });
        });
    }

    if (applicationId) {
        if (toggleFiltersButton) toggleFiltersButton.style.display = "none";
        if (backButton) backButton.style.display = "block";
        if (createButton) createButton.style.display = "none";
        fetchApplicationDetails(applicationId)
            .then(data => {
                if (applicationsDiv) {
                    renderApplications([data], true, true);
                }
            })
            .catch(error => console.error("Error fetching application details:", error));
    } else {
        if (toggleFiltersButton) toggleFiltersButton.style.display = "block";
        if (createButton) createButton.style.display = "block";
        fetchApplications()
            .then(data => {
                if (applicationsDiv) {
                    renderApplications(data, false);
                }
            })
            .catch(error => console.error("Error fetching applications:", error));
    }
}
