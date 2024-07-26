import { editApplicationComponent } from '../../components/EditApplicationComponent.js';


document.addEventListener('DOMContentLoaded', () => {
    editApplicationComponent();
});

export function updateApplication(applicationData) {
    return fetch(`/api/update_application/${applicationData.application_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData)
    });
}