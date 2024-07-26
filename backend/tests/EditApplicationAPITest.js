const request = require('supertest');
const app = require('../index.js');
const connection = require('../config/db.js'); 
const editApplicationRouter =  require('../src/api/EditApplicationAPI.js');

let server;
app.use('/', editApplicationRouter);

const TEST_PORT = 3005; // Use a different port for testing

beforeAll((done) => {
  server = app.listen(TEST_PORT, (err) => {
    if (err) {
      return done(err);
    }
    done();
  });
});

afterAll((done) => {
  server.close((err) => {
    if (err) {
      return done(err);
    }
    connection.end((err) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});
jest.setTimeout(60000);

describe('Update Application API', () => {

  it('should update an application with valid data', async () => {
    const updateData = {
      applicant_name: 'Jane Doe',
      applicant_phone: '0987654321',
      applicant_email: 'jane.doe@example.com',
      description: 'Updated description'
    };

    const applicationId = 'fev112066634';
    const response = await request(app)
    
      .put(`/${applicationId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Application updated successfully');
  },60000);

  it('should handle non-existent application ID', async () => {
    const nonExistentId = 'nonexistentid123';
  
    const updateData = {
      applicant_name: 'Jane Doe',
      applicant_phone: '0987654321',
      applicant_email: 'jane.doe@example.com',
      description: 'Updated description'
    };
  
    const response = await request(app)
      .put(`/2}`)
      .send(updateData);
  
    expect(response.status).toBe(404);
    expect(response.text).toBe('Application not found');
  },60000);

});
