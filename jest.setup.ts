/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

console.log('Loaded test environment variables from .env.test');
