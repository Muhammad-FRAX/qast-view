const User = require('../models/User');
const Template = require('../models/Template');
const Report = require('../models/Report');

(async () => {
  // Create an admin user
  await User.create({
    id: 'user-1',
    username: 'admin',
    password: 'Welcome@123', // This will be hashed
    role: 'admin',
    requiresPasswordChange: false
  });

  // Optionally, add templates and reports here

  console.log('Seeding complete!');
  process.exit(0);
})();
