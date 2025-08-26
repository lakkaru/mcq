const { connectDB } = require('./src/config/database');
const User = require('./src/models/User');

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { userType: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.userName);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      userName: 'admin',
      email: 'admin@mcq.com',
      password: 'admin123', // Change this password!
      firstName: 'System',
      lastName: 'Administrator',
      userType: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true
    };

    const admin = await User.create(adminData);

    console.log('Admin user created successfully!');
    console.log('Username:', admin.userName);
    console.log('Email:', admin.email);
    console.log('Password: admin123 (Please change this!)');
    console.log('User Type:', admin.userType);

    process.exit(0);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
