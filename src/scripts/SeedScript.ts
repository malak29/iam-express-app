import * as UserModel from '../models/UserModel'
import { createUser } from '../models/User'
import { EUserType, EDepartmentType, EUserStatus } from '../types/UserTypes'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Check if admin already exists
    try {
      const existingAdmin = await UserModel.getUserByEmail('admin@example.com')
      console.log('✅ Admin user already exists, skipping seed.')
      console.log(`📧 Email: ${existingAdmin.email}`)
      console.log(`👤 Name: ${existingAdmin.name}`)
      return
    } catch (error) {
      // Admin doesn't exist, proceed with seeding
      console.log('👤 No admin user found, creating one...')
    }

    // Create admin user
    const adminData = {
      id: 'admin-001',
      name: 'System Administrator',
      email: 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      userType: EUserType.ADMIN,
      department: EDepartmentType.DEPARTMENT1,
      status: EUserStatus.ACTIVE
    }

    console.log('🔨 Creating admin user...')
    const admin = await createUser(adminData)
    await UserModel.addUser(admin)
    
    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${adminData.email}`)
    console.log(`🔑 Password: ${adminData.password}`)
    console.log('⚠️  IMPORTANT: Change the admin password immediately after first login!')
    console.log('')
    console.log('🚀 You can now login with:')
    console.log(`   POST /api/auth/login`)
    console.log(`   Body: { "email": "${adminData.email}", "password": "${adminData.password}" }`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Database seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error)
      process.exit(1)
    })
}

export default seedDatabase