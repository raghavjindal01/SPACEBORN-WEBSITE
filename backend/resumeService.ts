import path from 'path';
import { Readable } from 'stream';
import { getOrCreateDriveFolder } from './googleDrive';

type ResumeSubmission = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  originalFileName: string;
  mimeType?: string;
  fileBuffer: Buffer;
};

function getMimeType(fileExtension: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  switch (fileExtension) {
    case '.pdf':
      return 'application/pdf';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
}

export function getResumeFolderName() {
  return process.env.GOOGLE_DRIVE_RESUMES_FOLDER_NAME?.trim() || 'Resumes';
}

export function createSavedResumeFileName(originalFileName: string, timestamp = Date.now()) {
  const cleanOriginalName = originalFileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  return `${timestamp}_${cleanOriginalName}`;
}

export async function uploadResumeSubmission(submission: ResumeSubmission) {
  const timestamp = Date.now();
  const submissionId = `sub_${timestamp}`;
  const submittedAt = new Date(timestamp).toISOString();
  const savedFileName = createSavedResumeFileName(submission.originalFileName, timestamp);
  const fileExtension = path.extname(submission.originalFileName).toLowerCase();
  const { drive, folderId, folderName } = await getOrCreateDriveFolder(getResumeFolderName());

  const uploadedFile = await drive.files.create({
    requestBody: {
      name: savedFileName,
      parents: [folderId],
      appProperties: {
        submissionId,
        candidateName: submission.name,
        candidateEmail: submission.email,
        candidatePhone: submission.phone || '',
        originalFileName: submission.originalFileName,
        submittedAt,
      },
      description: submission.message || undefined,
    },
    media: {
      mimeType: getMimeType(fileExtension, submission.mimeType),
      body: Readable.from(submission.fileBuffer),
    },
    fields: 'id, name, webViewLink',
    supportsAllDrives: true,
  });

  return {
    submissionId,
    submittedAt,
    savedFileName,
    driveFileId: uploadedFile.data.id,
    driveFolderName: folderName,
  };
}
