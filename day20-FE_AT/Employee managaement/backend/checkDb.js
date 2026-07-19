const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function check() {
  const users = await User.findAll();
  console.log("USERS IN DATABASE:");
  for (let u of users) {
    const isMatch = await bcrypt.compare('admin123', u.password);
    console.log(`- Email: ${u.email}, Role: ${u.role}, PasswordHash: ${u.password}, Matches 'admin123': ${isMatch}`);
  }
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
