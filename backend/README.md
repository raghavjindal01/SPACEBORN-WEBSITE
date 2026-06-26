# Backend

Resume uploads are handled by the Next API route at `app/api/resume/route.ts`, which calls the backend services in this folder.

## Normal My Drive uploads

Normal Google Drive "My Drive" folders require OAuth user credentials. Service accounts can read shared folders, but Google does not give service accounts storage quota for normal My Drive uploads.

Use these env vars for normal My Drive:

```env
GOOGLE_DRIVE_CLIENT_ID="your-oauth-client-id"
GOOGLE_DRIVE_CLIENT_SECRET="your-oauth-client-secret"
GOOGLE_DRIVE_REFRESH_TOKEN="your-user-refresh-token"
GOOGLE_DRIVE_REDIRECT_URI="http://localhost:3000/api/google-drive/callback"
GOOGLE_DRIVE_RESUMES_FOLDER_NAME="Resumes"
GOOGLE_DRIVE_PARENT_FOLDER_ID="your-normal-my-drive-folder-id"
```

When the OAuth vars are present, the backend uploads as that Google user and uses that user's My Drive storage quota.

The older service account vars still work for Shared Drive setups.
