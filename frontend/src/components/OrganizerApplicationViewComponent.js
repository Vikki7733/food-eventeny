import { organizerFetchApplicationDetails } from "../pages/OrganizerApplicationViewPage/OrganizerApplicationViewPage.js";

function renderApplications(application) {

    const items = application.items || [];
    const itemsHTML = items.map(item => `
        <tr>
            <td>${item.item_name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
        </tr>
    `).join('');
    return `
         <div class="centered-container">
            <div class="card">
                <h5 class="card-title">Application Name: ${application.applicant_name}</h5>
                <p class="card-text">ID: <a href="#" class="application-link" data-id="${application.application_id}">${application.application_id}</a></p>
                <p class="card-text">Status: ${application.status}</p>
                <p class="card-text">Cuisine Type: ${application.cuisine_type || ''}</p>
                <p class="card-text">Description: ${application.description || ''}</p>
                <p class="card-text">Phone: ${application.applicant_phone || ''}</p>
                <p class="card-text">Email: ${application.applicant_email || ''}</p>
                <p class="card-text">Created Date: ${application.created_date || ''}</p>
                <p class="card-text">Venue Location: ${application.venue_location || ''}</p>
                <p class="card-text">Allocated Location: ${application.allocated_location || ''}</p>
                <p class="card-text">Organizer Comments: ${application.organizer_comments || ''}</p>
                <p class="card-text">Requester Comments: ${application.requester_comments || ''}</p>
                <h4 class="card-text">Items Total Price:${application.total_price || ''}</h4>
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
            </div>
        </div>
    `;
}

export function organizerApplicationViewComponent() {
    const applicationsDiv = document.getElementById("applications");
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('application_id');

    if (applicationId) {
        organizerFetchApplicationDetails(applicationId)
            .then(data => {
                if (applicationsDiv) {
                    const applicationHTML = renderApplications(data);
                    applicationsDiv.innerHTML = applicationHTML;
                }
            })
            .catch(error => console.error("Error fetching application details:", error));
    }
}
