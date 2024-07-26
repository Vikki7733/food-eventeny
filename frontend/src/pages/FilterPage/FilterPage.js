import { filterApplicationComponent } from "../../components/FilterApplicationComponent.js";

export function searchApplication(callback) {
    const filterButton = document.getElementById('filterButton');

    if (filterButton) {
        filterButton.addEventListener('click', async (event) => {
            event.preventDefault();
        try {
            const filterInputs = await filterApplicationComponent();
            const queryString = new URLSearchParams(filterInputs).toString();

            const response = await fetch(`/api/search_application/filter?${queryString}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
                if (callback) {
                    callback(data);
                }
} catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
}
    });
}
}