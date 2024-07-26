import { createApplication } from '../pages/CreatePage/CreatePage.js';

export function createApplicationComponent() {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById("applicationForm");
        const itemInputs = document.querySelectorAll('.item-quantity');
        const totalCostElement = document.getElementById('totalCost');
        let items = {};
        if (!form) {
            console.error("Form with ID 'applicationForm' not found.");
            return; 
        }

        itemInputs.forEach(input => {
            input.addEventListener('input', updateTotalCost);
            input.addEventListener('change', updateItems); 
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
                console.log("Form submitted.");
                const applicantName = document.getElementById("applicantName").value;
                const description = document.getElementById("description").value;
                const applicantPhone = document.getElementById("applicantPhone").value;
                const applicantEmail = document.getElementById("applicantEmail").value;
                const cuisine_type = document.getElementById("cuisineType").value;
                const venue_location = document.getElementById("venueLocation").value;
                const requester_comments = document.getElementById("requesterComments").value;
                itemInputs.forEach(input => {
                    const itemName = input.id;
                    const quantity = parseInt(input.value) || 0;
                    if (quantity > 0) {
                        items[itemName] = {
                            quantity: quantity,
                            price: getPrice(itemName) 
                        };
                    }
                });
                createApplication(applicantName, description, applicantPhone, applicantEmail,
                     cuisine_type, venue_location, items, requester_comments)
                    .then((response) => {
                        if (response.ok) {
                            console.log("Application created successfully.", response);
                            window.location.href = "/api/applicant_view";
                        } else {
                            return response.text().then(text => {
                                throw new Error(text);
                            });
                        }
                    })
                    .catch((error) => console.error("Error creating application:", error));
                });
                function updateItems() {
                    itemInputs.forEach(input => {
                        const itemName = input.id; 
                        const quantity = parseInt(input.value) || 0;
                        if (quantity > 0) {
                            items[itemName] = {
                                quantity: quantity,
                                price: getPrice(itemName) * quantity
                            };
                        } else {
                            delete items[itemName];
                        }
                    });
                }
        
                function updateTotalCost() {
                    const prices = {
                        chairs: 5,
                        tables: 7,
                        souvenirs: 9,
                        drinks: 8
                    };
        
                    let totalCost = 0;
                    itemInputs.forEach(input => {
                        const itemName = input.id;
                        const quantity = parseInt(input.value) || 0;
                        totalCost += (quantity * prices[itemName]);
                    });
        
                    totalCostElement.textContent = `$${totalCost.toFixed(2)}`;
                }
        
                function getPrice(itemName) {
                    const prices = {
                        chairs: 5,
                        tables: 7,
                        souvenirs: 9,
                        drinks: 8
                    };
                    return prices[itemName] || 0;
                }
            });
            const backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    navigateTo('/api/applicant_view');
                });
            }
        
        
        function navigateTo(url) {
            window.location.href = url;
        }   
    }
        