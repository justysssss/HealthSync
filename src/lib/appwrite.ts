import { Client, Account, Storage, Databases, ID, Query, Models } from 'appwrite';

interface FileDocument extends Models.Document {
  name: string;
  type: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  storageId?: string; // For files stored in Appwrite Storage
  mimeType?: string;  // For file type detection and previews
  size?: number;      // File size in bytes
}

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export { ID };

// List files and folders
export async function listFiles(): Promise<FileDocument[]> {
  try {
    // Get the current user's ID
    const user = await account.get();
    const userId = user.$id;

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
      [
        Query.equal('userId', userId),
        Query.orderDesc('type'),
        Query.orderAsc('name')
      ]
    );
    
    return response.documents as FileDocument[];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Create folder helper
export async function createFolder(name: string, parentId: string | null = null): Promise<FileDocument> {
  try {
    const user = await account.get();
    const userId = user.$id;

    const folder = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
      ID.unique(),
      {
        name: name,
        type: "folder",
        userId: userId,
        parentId: parentId,
        createdAt: new Date().toISOString(),
      }
    );
    return folder as FileDocument;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// File upload helper
export async function uploadFile(file: File, parentId: string | null = null): Promise<FileDocument> {
  try {
    const user = await account.get();
    const userId = user.$id;

    // Upload file to storage first
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
      ID.unique(),
      file
    );

    // Create file metadata in database with storage file ID
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
      ID.unique(),
      {
        name: file.name,
        type: "file",
        userId: userId,
        parentId: parentId,
        createdAt: new Date().toISOString(),
        storageId: uploadedFile.$id, // Link to the storage file
        mimeType: file.type, // Store the file type for previews
        size: file.size // Store file size for display
      }
    );

    return document as FileDocument;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export type { FileDocument };
