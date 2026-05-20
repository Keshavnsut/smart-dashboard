// Provide safe local defaults when .env is not present (dev only)
process.env.MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/smart_leads_dashboard'
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'dev-secret-please-change-this-to-a-strong-secret-1234'

import mongoose from 'mongoose'

async function seed() {
  // dynamic imports to avoid hoisted modules reading env before defaults
  const { connectToDatabase } = await import('../config/db.js')
  const repo = await import('../repositories/userRepository.js')
  const leadRepo = await import('../repositories/leadRepository.js')
  const enums = await import('../types/enums.js')

  await connectToDatabase()

  try {
    const userCount = await repo.countUsers()
    if (userCount === 0) {
      console.log('Creating admin user: admin@example.com / Password123!')
      await repo.createUser({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Password123!',
        role: enums.UserRole.Admin,
      })
    } else {
      console.log('Users exist, skipping admin creation')
    }

    const sampleLeads = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        status: enums.LeadStatus.New,
        source: enums.LeadSource.Website,
      },
      {
        name: 'Bob Patel',
        email: 'bob@example.com',
        status: enums.LeadStatus.Contacted,
        source: enums.LeadSource.Instagram,
      },
      {
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        status: enums.LeadStatus.Qualified,
        source: enums.LeadSource.Referral,
      },
    ]

    const admin = await repo.findUserByEmail('admin@example.com')
    const adminId = admin?._id ?? new mongoose.Types.ObjectId()

    for (const l of sampleLeads) {
      console.log('Creating lead', l.name)
      await leadRepo.createLead({
        name: l.name,
        email: l.email,
        status: l.status,
        source: l.source,
        createdBy: adminId,
      })
    }

    console.log('Seeding complete')
  } catch (err) {
    console.error('Seeding failed', err)
  } finally {
    await mongoose.disconnect()
  }
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

