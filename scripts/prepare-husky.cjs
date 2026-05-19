/**
 * Runs husky locally; skips in CI/Docker/Railway when husky is not installed.
 */
const { execSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

if (process.env.HUSKY === '0' || process.env.CI === 'true' || process.env.RAILWAY_ENVIRONMENT) {
  process.exit(0);
}

const huskyBin = path.join(__dirname, '..', 'node_modules', '.bin', 'husky');
if (!existsSync(huskyBin)) {
  process.exit(0);
}

execSync('husky', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
