const connection = require('../../config/db');

async function filterApplications(filters) {
    try {
        const sqlResults = await searchSQL(filters);
        return { results: sqlResults };
    } catch (error) {
        throw error;
    }
}

function searchSQL(filters) {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT 
                a.application_id,
                a.applicant_name,
                a.status,
                a.description,
                a.applicant_phone,
                a.applicant_email,
                a.created_date,
                a.venue_location,
                a.cuisine_type,
                o.organizer_id,
                o.organizer_comments,
                o.allocated_location,
                o.update_date AS organizer_updated_date
            FROM 
                application_table a
            LEFT JOIN 
                organizer_table o ON a.application_id = o.application_id
            WHERE 1=1`;

        const queryParams = [];

        const fields = ['application_id', 'applicant_name', 'status', 'venue_location', 'cuisine_type'];

        fields.forEach(field => {
            if (filters[field]) {
                const values = filters[field].split(',').map(value => value.trim());
                if (values.length > 0) {
                    query += ` AND (${values.map(() => `a.${field} LIKE ?`).join(' OR ')})`;
                    queryParams.push(...values.map(value => `%${value}%`));
                }
            }
        });

        connection.query(query, queryParams, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getSuggestions() {
    try {
        const suggestions = {};
        suggestions.application_id = await fetchUniqueValues('application_id', 'application_table');
        suggestions.applicant_name = await fetchUniqueValues('applicant_name', 'application_table');
        suggestions.status = await fetchUniqueValues('status', 'application_table');
        suggestions.venue_location = await fetchUniqueValues('venue_location', 'application_table');
        suggestions.cuisine_type = await fetchUniqueValues('cuisine_type', 'application_table');
        return suggestions;
    } catch (error) {
        throw error;
    }
}

function fetchUniqueValues(field, table) {
    return new Promise((resolve, reject) => {
        const query = `SELECT DISTINCT ${field} FROM ${table}`;
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.map(row => row[field]));
            }
        });
    });
}

module.exports = { filterApplications, getSuggestions };
