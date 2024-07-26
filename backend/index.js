const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const createApplicationAPI = require('./src/api/CreateApplicationAPI');
const viewApplicationAPI = require('./src/api/ViewApplicationAPI');
const editApplicationAPI = require('./src/api/EditApplicationAPI');
const deleteApplicationAPI = require('./src/api/DeleteApplicationAPI');
const filterApplicationAPI = require('./src/api/FilterApplicationAPI');
const organizerApprovalApplicationAPI = require('./src/api/OrganizerApprovalApplicationAPI');
const organizerApplicationViewAPI = require('./src/api/OrganizerApplicationViewAPI');


const app = express();
const port = process.env.PORT || 3004;
const fs = require('fs');

const filePath = path.join(__dirname, '../frontend/src/pages/EditPage/EditPage.html');

fs.access(filePath, fs.constants.F_OK, (err) => {
  console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
});

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.redirect('/api/applicant_view');
  });

  // Serve static files from the 'frontend/src' directory
app.use(express.static(path.join(__dirname, '../frontend/src')));

// Content Security Policy Middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.use(express.json());

// API Routes
app.use('/api/create_application', createApplicationAPI);
app.use('/api/get_application', viewApplicationAPI);
app.use('/api/update_application', editApplicationAPI);
app.use('/api/delete_application', deleteApplicationAPI);
app.use('/api/search_application', filterApplicationAPI);
app.use('/api/status_update', organizerApprovalApplicationAPI);
app.use('/api/organizer_application', organizerApplicationViewAPI);
app.use('/api/get_suggestions', filterApplicationAPI);

// Serve index.html for all other routes
app.get('/api/applicant_create', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/CreatePage/CreatePage.html');
  console.log('Serving file:', filePath);
  res.sendFile(filePath);
});

// Serve index.html for all other routes
app.get('/api/applicant_view', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/ViewPage/ViewPage.html');
  console.log('Serving file Viewpage:', filePath);
  res.sendFile(filePath);
});

app.get('/api/applicant_edit', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/EditPage/EditPage.html');
  console.log('Serving file Viewpage:', filePath);
  res.sendFile(filePath);
});

app.get('/api/organizer_view', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/OrganizerPage/OrganizerPage.html');
  console.log('Serving file OrganizerPage:', filePath);
  res.sendFile(filePath);
});

app.get('/api/organizer_manage', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/OrganizerWorkflowPage/OrganizerWorkflowPage.html');
  console.log('Serving file OrganizerWorkflow:', filePath);
  res.sendFile(filePath);
});

app.get('/api/organizer_final', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/OrganizerApplicationViewPage/OrganizerApplicationViewPage.html');
  console.log('Serving file OrganizerWorkflow:', filePath);
  res.sendFile(filePath);
});

app.get('/api/filter_application', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/src/pages/FilterPage/FilterPage.html');
  console.log('Serving file OrganizerWorkflow:', filePath);
  res.sendFile(filePath);
});

app.use(cors());

if(process.env.NODE_ENV !== 'test') {
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
}

module.exports = app;
