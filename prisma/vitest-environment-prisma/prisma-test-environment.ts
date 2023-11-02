import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  // since database url is a real url we need to manipulate this var to generate a new url with random database schema
  // each test switch will have its own database schema
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    // change DATABASE_URL env var to the new one with random schema
    process.env.DATABASE_URL = databaseURL

    // executing migrations using node execSync with deploy - migrate deploy skips the db schema comparing
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // finally excluding the new database schema created for the test switch
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        // and disconnect to database
        await prisma.$disconnect()
      },
    }
  },
}
