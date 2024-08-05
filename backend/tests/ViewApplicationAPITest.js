const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../config/db.js');
const viewApplicationRouter = require('../src/api/ViewApplicationAPI.js');
const { viewApplication, viewApplicationById } = require('../src//dao/ViewApplicationDAO.js');
const app = express();

app.use(bodyParser.json());
app.use('/', viewApplicationRouter);

jest.mock('../src/dao/ViewApplicationDAO.js');

let server;

beforeAll((done) => {
  server = app.listen(3004, () => {
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    connection.end(() => {
      done();
    });
  });
});

jest.setTimeout(30000);

describe('GET /list - Retrieving applications list', () => {
  it('should return 200 and a list of applications', async () => {
    const mockApplications = [
      { application_id: 'fev296868', name: 'Food Truck' },
      { application_id: 'fev625328', name: 'FoodOnWheels' }
    ];
    viewApplication.mockImplementation((callback) => callback(null, mockApplications));

    const response = await request(app).get('/list');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(viewApplication).toHaveBeenCalled();
  });

  it('should return 500 if there is an error fetching applications', async () => {
    viewApplication.mockImplementation((callback) => callback(new Error('Error fetching applications'), null));

    const response = await request(app).get('/list');

    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual('Error fetching applications');
    expect(viewApplication).toHaveBeenCalled();
  });
});

describe('GET /:id - Retrieving a single application by ID', () => {
  it('should return 200 and the application data', async () => {
    const mockApplication = { application_id: 'fev296868', name: 'Food Truck' }
    viewApplicationById.mockImplementation((id, callback) => callback(null, mockApplication));

    const response = await request(app).get('/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Food Truck');
    expect(viewApplicationById).toHaveBeenCalledWith('1', expect.any(Function));
  });

  it('should return 404 if the application does not exist', async () => {
    viewApplicationById.mockImplementation((id, callback) => callback(null, null));

    const response = await request(app).get('/999');

    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('Application not found');
    expect(viewApplicationById).toHaveBeenCalledWith('999', expect.any(Function));
  });

  it('should return 500 if there is an error fetching the application', async () => {
    viewApplicationById.mockImplementation((id, callback) => callback(new Error('Error fetching application'), null));

    const response = await request(app).get('/1');

    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual('Error fetching application');
    expect(viewApplicationById).toHaveBeenCalledWith('1', expect.any(Function));
  });
});
