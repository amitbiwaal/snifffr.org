// Generates the ADMIN_PASSWORD_HASH value for .env.local
// Usage: npm run hash-password -- "your-strong-password"
import { randomBytes, scryptSync } from 'node:crypto'

const password = process.argv[2]
if (!password || password.length < 10) {
  console.error('Usage: npm run hash-password -- "a-password-of-at-least-10-characters"')
  process.exit(1)
}
const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
// ":" is used as the separator because "$" would be expanded inside .env files.
console.log(`scrypt:${salt}:${hash}`)
