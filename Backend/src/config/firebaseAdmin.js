const admin = require('firebase-admin');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'poject-k-8eb1a',
};

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: serviceAccount.projectId,
});

module.exports = admin;