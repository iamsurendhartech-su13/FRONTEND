require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { User, Employee, Department, Attendance, Salary, Settings } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`[API RESPONSE] ${req.method} ${req.url} - Status: ${res.statusCode} - Data: ${JSON.stringify(data)}`);
    return originalJson.call(this, data);
  };
  next();
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "Backend Running"
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 5000;

// Sync DB and Start Server
sequelize.sync().then(async () => {
  console.log('✓ Database Connected');
  
  // Create or verify default admin
  const bcrypt = require('bcryptjs');
  let adminUser = await User.findOne({ where: { email: 'admin@admin.com' }});
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Default admin created: admin@admin.com / admin123');
  } else {
    const isCorrect = await bcrypt.compare('admin123', adminUser.password);
    if (!isCorrect) {
      console.log('Updating existing admin user password to correct bcrypt hash...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser.password = hashedPassword;
      await adminUser.save();
    }
  }
  console.log('✓ Admin User Exists');

  // Seed default settings if empty
  const settingsCount = await Settings.count();
  if (settingsCount === 0) {
    await Settings.create({
      id: 1,
      companyName: 'Employee Management System',
      companyEmail: 'admin@company.com',
      companyPhone: '123-456-7890',
      companyAddress: '123 Business Rd',
      themeMode: 'light',
      emailNotifications: false,
      pushNotifications: false
    });
    console.log('Default settings seeded successfully.');
  }

  // Seed default department if empty
  const deptCount = await Department.count();
  let defaultDeptId = null;
  if (deptCount === 0) {
    const dept = await Department.create({
      id: 1,
      name: 'electronic ',
      head: 'rakesh',
      count: 1
    });
    defaultDeptId = dept.id;
    console.log('Default department "electronic " seeded successfully.');
  } else {
    const dept = await Department.findOne({ where: { name: 'electronic ' } });
    if (dept) defaultDeptId = dept.id;
  }

  // Seed default department IT if not exists
  const itDept = await Department.findOne({ where: { name: 'IT' } });
  if (!itDept) {
    await Department.create({
      name: 'IT',
      head: 'Test Manager',
      count: 0
    });
    console.log('Default department "IT" seeded successfully.');
  }

  // Seed default employee if empty
  const empCount = await Employee.count();
  if (empCount === 0) {
    await Employee.create({
      id: 1,
      employeeId: 'EMP001',
      name: 'rakesh',
      email: 'rakesh@gmail.com',
      phone: '9876543210',
      gender: 'Male',
      dob: '1995-05-15',
      address: 'Chennai',
      department: 'electronic ',
      departmentId: defaultDeptId,
      designation: 'chennai',
      joiningDate: '2020-01-15',
      salary: 678900,
      employmentType: 'Full-Time',
      status: 'Active',
      avatar: 'https://ui-avatars.com/api/?name=rakesh&background=14b8a6&color=fff'
    });
    console.log('Default employee "rakesh" seeded successfully.');
  }

  console.log('✓ Routes Loaded');

  app.listen(PORT, () => {
    console.log(`✓ Server Running on port ${PORT}`);
  });
}).catch(err => console.error('Database connection error:', err));
