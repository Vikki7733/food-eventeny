import { createApplicationComponent } from '../../components/CreateApplicationComponent.js';

// Initialize the createApplicationComponent to setup form submission handling
createApplicationComponent();

export function createApplication(applicantName, description, applicantPhone, applicantEmail,
    cuisineType, venueLocation, items, requesterComments) {
    return fetch("/api/create_application/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            applicant_name: applicantName,
            description: description,
            applicant_phone: applicantPhone,
            applicant_email: applicantEmail,
            cuisine_type: cuisineType,
            venue_location: venueLocation,
            items: items,
            requester_comments: requesterComments
        }),
    });
}
