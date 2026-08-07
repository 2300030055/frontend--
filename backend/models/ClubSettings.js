const mongoose = require('mongoose');

const clubSettingsSchema = new mongoose.Schema(
  {
    clubName: { type: String, default: 'WebApps Club' },
    clubLogo: { type: String, default: '' },
    sacLogo: { type: String, default: '' },
    defaultStudentPassword: { type: String, default: 'webapps@123' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClubSettings', clubSettingsSchema);
