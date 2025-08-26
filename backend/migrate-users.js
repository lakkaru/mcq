// Migration script to handle existing users table
const { connectDB, sequelize } = require('./src/config/database');

const migrateUsersTable = async () => {
  try {
    await connectDB();

    console.log('Starting users table migration...');

    // Check if users table exists
    const QueryInterface = sequelize.getQueryInterface();
    const tableExists = await sequelize.query(
      "SELECT to_regclass('public.users') as exists",
      { type: sequelize.QueryTypes.SELECT }
    );

    if (tableExists[0].exists) {
      console.log('Users table exists, dropping it...');
      await QueryInterface.dropTable('users');
    }

    console.log('Creating users table with new structure...');
    
    // Now sync the models to create the table with the correct structure
    const User = require('./src/models/User');
    await User.sync({ force: true });

    console.log('Users table migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUsersTable();
