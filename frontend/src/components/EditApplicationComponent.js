import { updateApplication } from "../pages/EditPage/EditPage.js";
import { fetchApplicationDetails } from "../pages/ViewPage/ViewPage.js";

export function editApplicationComponent() {

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const applicationId = document.getElementById('editApplicationId').value;
    const applicantName = document.getElementById('editApplicantName').value;
    const description = document.getElementById('editDescription').value;
    const applicantPhone = document.getElementById('editApplicantPhone').value;
    const applicantEmail = document.getElementById('editApplicantEmail').value;
    const requesterComments = document.getElementById('editRequesterComments').value;
    const venueLocation = document.getElementById('editVenueLocation').value;

    updateApplication({
        application_id: applicationId,
        applicant_name: applicantName,
        description: description,
        applicant_phone: applicantPhone,
        applicant_email: applicantEmail,
        requester_comments: requesterComments,
        venue_location: venueLocation
    }).then(() => {
        window.location.href = "/api/applicant_view";
    }).catch(error => console.error("Error updating application:", error));
}

// Function to initialize the edit page
function initializeEditPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('application_id');

    if (applicationId) {
        fetchApplicationDetails(applicationId)
            .then(data => {
                document.getElementById('editApplicationId').value = data.application_id;
                document.getElementById('editApplicantName').value = data.applicant_name;
                document.getElementById('editDescription').value = data.description;
                document.getElementById('editApplicantPhone').value = data.applicant_phone;
                document.getElementById('editApplicantEmail').value = data.applicant_email;
                document.getElementById('editRequesterComments').value = data.requester_comments;
                document.getElementById('editVenueLocation').value = data.venue_location;
            })
            .catch(error => console.error("Error fetching application details:", error));
    } else {
        console.error("No application_id found in URL.");
    }

    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleFormSubmit);
    }

    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            window.location.href = "/api/applicant_view";
        });
    }
}

initializeEditPage();

}