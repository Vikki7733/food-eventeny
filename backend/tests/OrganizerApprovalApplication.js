const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const organizerApprovalApplicationRouter = require('../src/api/OrganizerApprovalApplicationAPI.js');
const { updateApplicationStatus } = require('../src/dao/OrganizerApplicationWorkflowDAO.js');
const app = express();

app.use(bodyParser.json());
app.use('/', organizerApprovalApplicationRouter);

jest.mock('../src/dao/OrganizerApplicationWorkflowDAO.js', () => ({
  updateApplicationStatus: jest.fn(),
}));

describe('PUT /:id - Updating organizer application status', () => {
  it('should return 200 and success message when application is updated successfully', async () => {
    const mockResult = { affectedRows: 1 };
    updateApplicationStatus.mockResolvedValue(mockResult);

    const response = await request(app)
      .put('/1')
      .send({ action: 'approve', details: 'Approved by admin' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Application updated successfully', result: mockResult });
    expect(updateApplicationStatus).toHaveBeenCalledWith('1', 'approve', expect.any(Object));
  });

  it('should return 400 when application ID or action is missing', async () => {
    const response = await request(app)
      .put('/1')
      .send({ details: 'Missing action' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: 'Application ID and action are required' });
  });

  it('should return 500 when there is an error updating the application', async () => {
    updateApplicationStatus.mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .put('/2')
      .send({ action: 'reject', details: 'Rejected due to criteria' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: 'Error updating application' });
  });
});
