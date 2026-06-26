import { google } from 'googleapis';

const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';

function getOAuthDriveClient() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:3000/api/google-drive/callback';

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  auth.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: 'v3', auth });
}

function getServiceAccountDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive service account env vars are not configured.');
  }

  if (!clientEmail.endsWith('.iam.gserviceaccount.com')) {
    throw new Error(
      'GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL must be the service account client_email ending in .iam.gserviceaccount.com, not a regular Gmail address.'
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: [DRIVE_SCOPE],
  });

  return google.drive({ version: 'v3', auth });
}

export function getDriveClient() {
  const oauthDriveClient = getOAuthDriveClient();

  if (oauthDriveClient) {
    return oauthDriveClient;
  }

  return getServiceAccountDriveClient();
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function getParentFolderId() {
  const value = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID?.trim();

  if (!value) {
    return undefined;
  }

  const folderUrlMatch = value.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderUrlMatch) {
    return folderUrlMatch[1];
  }

  const queryIdMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryIdMatch) {
    return queryIdMatch[1];
  }

  return value;
}

export async function getOrCreateDriveFolder(folderName: string) {
  const drive = getDriveClient();
  const parentFolderId = getParentFolderId();
  const parentQuery = parentFolderId ? ` and '${escapeDriveQueryValue(parentFolderId)}' in parents` : '';

  const existingFolder = await drive.files.list({
    q: `mimeType='${DRIVE_FOLDER_MIME_TYPE}' and name='${escapeDriveQueryValue(folderName)}' and trashed=false${parentQuery}`,
    fields: 'files(id, name)',
    pageSize: 1,
    spaces: 'drive',
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  const folderId = existingFolder.data.files?.[0]?.id;
  if (folderId) {
    return { drive, folderId, folderName };
  }

  const createdFolder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: DRIVE_FOLDER_MIME_TYPE,
      ...(parentFolderId ? { parents: [parentFolderId] } : {}),
    },
    fields: 'id, name',
    supportsAllDrives: true,
  });

  if (!createdFolder.data.id) {
    throw new Error('Google Drive did not return an id for the resumes folder.');
  }

  return { drive, folderId: createdFolder.data.id, folderName };
}
