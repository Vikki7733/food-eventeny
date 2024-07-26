import { renderApplications } from "../components/ViewApplicationComponent.js";
import { fetchApplications } from "../pages/ViewPage/ViewPage.js";

export async function filterApplicationComponent(isOrganizerPage = false) {
    await loadFilterPageContent(isOrganizerPage);
    if (!isOrganizerPage) {
        await fetchAndPopulateSuggestions();
        setupFilterButton();
        setupClearButton();
        setupToggleButton();
    } 
}
async function fetchAndPopulateSuggestions() {
    try {
        const response = await fetch('/api/search_application/suggestions');
        const { suggestions } = await response.json();

        populateDatalist('filterApplicationIdsDatalist', suggestions.application_id);
        populateDatalist('filterApplicantNameDatalist', suggestions.applicant_name);
        populateDatalist('filterStatusDatalist', suggestions.status);
        populateDatalist('filterLocationDatalist', suggestions.venue_location);
        populateDatalist('filterCuisineTypeDatalist', suggestions.cuisine_type);
    } catch (error) {
        console.error('Failed to fetch suggestions:', error);
    }
}

function populateDatalist(datalistId, values) {
    const datalist = document.getElementById(datalistId);
    if (datalist) {
        datalist.innerHTML = values.map(value => `<option value="${value}">`).join('');
    }
}


function getFilterInputs() {
    const filterInputs = {
        application_id: document.getElementById('filterApplicationIds').value.split(',').map(id => id.trim()).filter(id => id),
        applicant_name: document.getElementById('filterApplicantName').value.split(',').map(name => name.trim()).filter(name => name),
        status: document.getElementById('filterStatus').value.split(',').map(status => status.trim()).filter(status => status),
        venue_location: document.getElementById('filterLocation').value.split(',').map(location => location.trim()).filter(location => location),
        cuisine_type: document.getElementById('filterCuisineType').value.split(',').map(cuisine => cuisine.trim()).filter(cuisine => cuisine),
    };

    Object.keys(filterInputs).forEach(key => {
        if (!filterInputs[key] || (Array.isArray(filterInputs[key]) && filterInputs[key].length === 0)) {
            delete filterInputs[key];
        }
    });
    return filterInputs;
}


function updateFilterInputsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('filterApplicationIds').value = urlParams.get('application_id') || '';
    document.getElementById('filterApplicantName').value = urlParams.get('applicant_name') || '';
    document.getElementById('filterStatus').value = urlParams.get('status') || '';
    document.getElementById('filterLocation').value = urlParams.get('venue_location') || '';
    document.getElementById('filterCuisineType').value = urlParams.get('cuisine_type') || '';
}

async function loadFilterPageContent(isOrganizerPage) {
    try {
        const response = await fetch('/pages/FilterPage/FilterPage.html');
        const htmlContent = await response.text();
        const filterContainer = document.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.innerHTML = htmlContent;
            if (isOrganizerPage) {
                const filtersDiv = document.getElementById('filters');
                if (filtersDiv) {
                    filtersDiv.innerHTML = '<p>Coming soon... NO filters</p>';
                }
            } else {
                updateFilterInputsFromURL(); 
            }
        }
    } catch (error) {
        console.error('Failed to load filter page content:', error);
    }

}


function setupFilterButton() {
    const filterButton = document.getElementById('filterButton');
    if (filterButton) {
        filterButton.addEventListener('click', async () => {
            try {
                const filterInputs = getFilterInputs();
                const queryString = new URLSearchParams(filterInputs).toString();

                const response = await fetch(`/api/search_application/filter?${queryString}`);

                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    // Render the applications with the fetched data
                    renderApplications(data.results, false, false);
                } else {
                    console.error('No results found');
                    document.getElementById("applications").innerHTML = '<p>No results found.</p>';
                }
            } catch (error) {
                console.error('Failed to fetch filtered applications:', error);
            }
        });
    }
}

    function setupClearButton() {
        const applicationsDiv = document.getElementById("applications");
        const clearButton = document.getElementById('clearButton');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                document.getElementById('filterApplicationIds').value = '';
                document.getElementById('filterApplicantName').value = '';
                document.getElementById('filterStatus').value = '';
                document.getElementById('filterLocation').value = '';
                document.getElementById('filterCuisineType').value = '';
                document.getElementById("applications").innerHTML = '';
                fetchApplications()
            .then(data => {
                if (applicationsDiv) {
                    renderApplications(data, false, false);
                }
            })
            .catch(error => console.error("Error fetching applications:", error));
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const filtersDiv = document.getElementById('filters');
        if (!filtersDiv.classList.contains('hidden')) {
            filtersDiv.classList.add('hidden');
        }
        setupToggleButton();
    });
    
    function setupToggleButton() {
        const toggleFiltersButton = document.getElementById('toggleFiltersButton');
        const filtersDiv = document.getElementById('filters');
        toggleFiltersButton.addEventListener('click', function() {
            filtersDiv.classList.toggle('hidden');
            toggleFiltersButton.innerHTML = filtersDiv.classList.contains('hidden') ? '&#9654; Show Filters' : '&#9660; Hide Filters';
        });
    }
    

