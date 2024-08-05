import { organizerWorkflowMangeComponent } from '../../components/OrganizerWorkflowManageComponent.js';

document.addEventListener('DOMContentLoaded', () => {

    organizerWorkflowMangeComponent();
});

export function updateApplicationStatus(applicationId, action, organizerData) {
    return fetch(`/api/status_update/${applicationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...organizerData })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error updating application');
                });
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(`Error during ${action}:`, error);
            return Promise.reject(error);
        });
}
