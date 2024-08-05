import { viewApplicationComponent } from "../../components/ViewApplicationComponent.js";

// Initialize the viewApplicationComponent
viewApplicationComponent();

export async function fetchApplications() {
    try {
        const response = await fetch("/api/get_application/list");
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching applications:", error.message);
        throw error;
    }
}

export async function fetchApplicationDetails(applicationId) {
    const response = await fetch(`/api/get_application/${applicationId}`);
    return await response.json();
}

export function deleteApplication(applicationId) {
    return fetch(`/api/delete_application/${applicationId}`, {
        method: "DELETE"
    });

}
