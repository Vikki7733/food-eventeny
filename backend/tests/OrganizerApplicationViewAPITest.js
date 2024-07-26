const request = require('supertest');
const express = require('express');
const organizerApplicationViewRouter = require('../src/api/OrganizerApplicationViewAPI.js');
const { organizerViewApplication } = require('../src/dao/OrganizerApplicationViewDAO.js');
const app = express();

app.use(express.json());
app.use('/', organizerApplicationViewRouter);

jest.mock('../src/dao/OrganizerApplicationViewDAO.js', () => ({
  organizerViewApplication: jest.fn(),
}));

describe('GET /:id - Viewing organizer application', () => {
  it('should return 200 and the application data when the application is found', async () => {
    const mockApplication = { applicant_id: 'fev296868', applicant_name: 'Food Truck' };
    organizerViewApplication.mockImplementation((id, callback) => callback(null, mockApplication));

    const response = await request(app).get('/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockApplication);
    expect(organizerViewApplication).toHaveBeenCalledWith('1', expect.any(Function));
  });

  it('should return 404 when the application is not found', async () => {
    organizerViewApplication.mockImplementation((id, callback) => callback(null, null));

    const response = await request(app).get('/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: 'Application not found' });
    expect(organizerViewApplication).toHaveBeenCalledWith('999', expect.any(Function));
  });

  it('should return 500 when there is a server error', async () => {
    organizerViewApplication.mockImplementation((id, callback) => callback(new Error('Internal server error'), null));

    const response = await request(app).get('/2');
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching application' });
    expect(organizerViewApplication).toHaveBeenCalledWith('2', expect.any(Function));
  });
});