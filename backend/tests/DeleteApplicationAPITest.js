const request = require('supertest');
const express = require('express');
const deleteApplicationRouter = require('../src/api/DeleteApplicationAPI.js');
const { deleteApplication } = require('../src/dao/DeleteApplicationDAO.js');
const app = express();

app.use(express.json());
app.use('/', deleteApplicationRouter);

jest.mock('../src/dao/DeleteApplicationDAO.js', () => ({
  deleteApplication: jest.fn().mockImplementation((id, callback) => {
    if (id === '123') {
      callback(null, true);
    } else {
      callback(new Error('Failed to delete'), null);
    }
  }),
}));

describe('DELETE /:id', () => {
  it('should delete an application successfully', async () => {
    deleteApplication.mockImplementation((id, callback) => callback(null, true));

    const response = await request(app).delete('/1');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Application deleted successfully');
    expect(deleteApplication).toHaveBeenCalledWith('1', expect.any(Function));
  });

  it('should return an error if deletion fails', async () => {
    deleteApplication.mockImplementation((id, callback) => callback(new Error('Failed to delete'), null));

    const response = await request(app).delete('/123');
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Error deleting application');
    expect(deleteApplication).toHaveBeenCalledWith('123', expect.any(Function));
  });
});
