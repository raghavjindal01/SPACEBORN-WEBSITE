const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

function loadDotenv() {
  const envPath = path.join(process.cwd(), '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] ||= value;
  }
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

async function main() {
  loadDotenv();

  const clientId = requireEnv('GOOGLE_DRIVE_CLIENT_ID');
  const clientSecret = requireEnv('GOOGLE_DRIVE_CLIENT_SECRET');
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:3000/api/google-drive/callback';
  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [DRIVE_SCOPE],
  });

  console.log('\nOpen this URL, approve access, then paste the code parameter here:\n');
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question('\nCode: ');
  rl.close();

  const { tokens } = await auth.getToken(code.trim());

  if (!tokens.refresh_token) {
    throw new Error('Google did not return a refresh token. Re-run with prompt=consent or remove the app grant from your Google account and try again.');
  }

  console.log('\nAdd this to .env:\n');
  console.log(`GOOGLE_DRIVE_REFRESH_TOKEN="${tokens.refresh_token}"`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
