import { Client, Account, Storage, Databases, ID, Query, Models } from "appwrite";

interface FileDocument extends Models.Document {
  name: string;
  type: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
}

const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Configuration
const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '',
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID || '',
};

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// Get current user's ID
async function getCurrentUserId() {
  try {
    const user = await account.get();
    return user.$id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    throw new Error('User not authenticated');
  }
}

// File upload helper
async function uploadFile(file: File) {
  try {
    const userId = await getCurrentUserId();

    // Upload file to storage
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );

    // Create file metadata in database
    // Only include the essential attributes that exist in the collection
    await databases.createDocument(
      config.databaseId,
      config.filesCollectionId,
      ID.unique(),
      {
        name: file.name,
        type: "file",
        userId: userId,
        parentId: null,
        createdAt: new Date().toISOString()
      }
    );

    return uploadedFile;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Create folder helper
async function createFolder(name: string, parentId: string | null = null) {
  try {
    const userId = await getCurrentUserId();

    const folder = await databases.createDocument(
      config.databaseId,
      config.filesCollectionId,
      ID.unique(),
      {
        name: name,
        type: "folder",
        userId: userId,
        parentId: parentId,
        createdAt: new Date().toISOString(),
      }
    );
    return folder;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// List files and folders
async function listFiles(): Promise<FileDocument[]> {
  try {
    const userId = await getCurrentUserId();
    
    const response = await databases.listDocuments(
      config.databaseId,
      config.filesCollectionId,
      [
        // Query for the current user's files
        Query.equal('userId', userId),
        // Order by type first (folders before files) then by name
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

export { client, account, storage, databases, uploadFile, createFolder, listFiles };
