import { fetchApplicationDetails } from '../pages/ViewPage/ViewPage.js';
import { updateApplicationStatus } from '../pages/OrganizerWorkflowPage/OrganizerWorkflowPage.js'; 

function renderApplicationDetails(application) {
    const detailsContainer = document.getElementById('application-details');
    if (!detailsContainer) return;
    const itemsHTML = application.items.map(item => `
        <tr>
            <td class="card-text">${item.item_name}</td>
            <td class="card-text">${item.price}</td>
            <td class="card-text">${item.quantity}</td>
        </tr>
    `).join('');
    detailsContainer.innerHTML = `
    <div class="centered-container">
    <div class="card">
        <h5 class="card-title">Application Name: ${application.applicant_name}</h5>
        <p class="card-text">ID: ${application.application_id}</p>
        <p class="card-text">Status: ${application.status}</p>
        <p class="card-text">Cuisine Type: ${application.cuisine_type || ''}</p>
        <p class="card-text">Description: ${application.description || ''}</p>
        <p class="card-text">Phone: ${application.applicant_phone || ''}</p>
        <p class="card-text">Email: ${application.applicant_email || ''}</p>
        <p class="card-text">Created Date: ${application.created_date || ''}</p>
        <p class="card-text">Requester Comments: ${application.requester_comments || ''}</p>
        <label for="allocatedLocation">Venue Location</label> <br/>
        <input type="text" id="allocatedLocation" value="${application.venue_location || ''}">
        <label for="comments">Comments</label>
        <input type="text" id="comments" placeholder="Enter any comments to the vendor">
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
        <p>Total Price: $${parseFloat(application.total_price).toFixed(2)}</p>
            <div class="action-buttons">
        <button id="approveButton">Approve</button>
        <button id="rejectButton">Reject</button>
    </div>
        </div>
    </div>
    `;
}



function setupEventListeners(applicationId) {
    const buttons = ['approveButton', 'rejectButton'];
    
    buttons.forEach(buttonId => {
        const buttonElement = document.getElementById(buttonId)
        if (buttonElement) {
            buttonElement.addEventListener('click', async () => {
            const action = buttonId.replace('Button', '').toLowerCase();
            const allocatedLocation = document.getElementById('allocatedLocation').value;
            const organizerComments = document.getElementById('comments').value;
            const organizerData = { organizerComments, allocatedLocation };
            
            try {
            await updateApplicationStatus(applicationId, action, organizerData)
                    alert(`Application ${action}d successfully`);
                    navigateTo('/api/organizer_view');
                } catch (error) {
                    console.error(`Error during ${action}:`, error);
                    alert(`Failed to ${action} application. Please try again.`);
                }
            });
                
            
        } else {
            console.warn(`Button with ID ${buttonId} not found.`);
        }
    });

    document.getElementById('backButton').addEventListener('click', () => {
        navigateTo('/api/organizer_view');
    });
}

function navigateTo(url) {
    window.location.href = url;
}



export function organizerWorkflowMangeComponent() {
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('application_id');

    if (!applicationId) {
        console.error('No application ID provided.');
        return;
    }

    fetchApplicationDetails(applicationId)
        .then(data => {
            renderApplicationDetails(data);
            setupEventListeners(applicationId);
        })
        .catch(error => console.error("Error fetching application details:", error));
}
