import { Client, Account, Storage, Databases, ID, Query, Models } from "appwrite";

export interface FileDocument extends Models.Document {
  name: string;
  type: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  fieldId?: string;
  mimeType?: string;
  size?: number;
}

export interface MedicationDocument extends Models.Document {
  name: string;
  dosage: string;
  remaining: number;
  totalDays: number;
  schedule: string;
  userId: string;
  createdAt: string;
}

export interface AppointmentDocument extends Models.Document {
  doctor: string;
  speciality: string;
  date: string;
  time: string;
  location: string;
  userId: string;
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
  medicationsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MEDICATIONS_COLLECTION_ID || '',
  appointmentsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID || '',
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
async function uploadFile(file: File, parentId: string | null = null) {
  try {
    console.log('=== Upload File Started ===');
    console.log('File:', file.name);
    console.log('Parent Folder ID:', parentId);
    
    const userId = await getCurrentUserId();
    console.log('User ID:', userId);

    // Upload file to storage
    console.log('Uploading to storage...');
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );
    console.log('Storage file created:', uploadedFile);

    // Create file metadata
    const metadata = {
      name: file.name,
      type: "file",
      userId: userId,
      parentId: parentId, // Important: explicitly set parentId
      createdAt: new Date().toISOString(),
      fieldId: uploadedFile.$id,
      storageId: config.storageId,
      mimeType: file.type,
      size: file.size
    };

    console.log('Creating file metadata:', metadata);

    // Create document in database
    const fileMetadata = await databases.createDocument(
      config.databaseId,
      config.filesCollectionId,
      ID.unique(),
      metadata
    );

    console.log('File metadata created:', fileMetadata);
    return fileMetadata;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Create folder helper
async function createFolder(name: string, parentId: string | null = null) {
  try {
    console.log('=== Create Folder Started ===');
    console.log('Folder Name:', name);
    console.log('Parent Folder ID:', parentId);
    
    const userId = await getCurrentUserId();
    console.log('User ID:', userId);

    // Prepare folder data
    const folderData = {
      name: name,
      type: "folder",
      userId: userId,
      parentId: parentId, // Important: explicitly set parentId
      createdAt: new Date().toISOString(),
    };

    console.log('Creating folder with data:', folderData);

    // Create folder in database
    const folder = await databases.createDocument(
      config.databaseId,
      config.filesCollectionId,
      ID.unique(),
      folderData
    );

    console.log('Folder created:', folder);
    return folder;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

// List files and folders
async function listFiles(parentId: string | null = null): Promise<FileDocument[]> {
  try {
    console.log('=== List Files Started ===');
    console.log('Parent Folder ID:', parentId);
    
    const userId = await getCurrentUserId();
    console.log('User ID:', userId);

    // Build query array
    const queries = [
      Query.equal('userId', userId),
      Query.orderDesc('type'),
      Query.orderAsc('name')
    ];

    // Add parentId filter
    if (parentId === null) {
      console.log('Querying root folder (null parentId)');
      queries.push(Query.isNull('parentId'));
    } else {
      console.log('Querying specific folder:', parentId);
      queries.push(Query.equal('parentId', parentId));
    }

    console.log('Executing query with:', queries);

    // Get documents from database
    const response = await databases.listDocuments(
      config.databaseId,
      config.filesCollectionId,
      queries
    );

    console.log('Query results:', response.documents);
    return response.documents as FileDocument[];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Download file helper
async function downloadFile(fileDocument: FileDocument) {
  try {
    console.log('=== Download File Started ===');
    console.log('File:', fileDocument);

    if (!fileDocument.fieldId) {
      throw new Error('Field ID not found');
    }

    // Get the file URL
    const result = await storage.getFileView(
      config.storageId,
      fileDocument.fieldId
    );

    console.log('Download URL generated:', result);
    return result;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

// Delete file helper
async function deleteFile(fileDocument: FileDocument) {
  try {
    console.log('=== Delete File Started ===');
    console.log('File:', fileDocument);

    // Delete file from storage if it's a file (not a folder)
    if (fileDocument.type === 'file' && fileDocument.fieldId) {
      await storage.deleteFile(
        config.storageId,
        fileDocument.fieldId
      );
      console.log('File deleted from storage');
    }

    // Delete the document from database
    await databases.deleteDocument(
      config.databaseId,
      config.filesCollectionId,
      fileDocument.$id
    );
    console.log('File metadata deleted from database');

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Medication helpers
async function createMedication(data: Omit<MedicationDocument, '$id' | 'userId' | 'createdAt'>) {
  try {
    const userId = await getCurrentUserId();
    const medication = await databases.createDocument(
      config.databaseId,
      config.medicationsCollectionId,
      ID.unique(),
      {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
      }
    );
    return medication;
  } catch (error) {
    console.error('Error creating medication:', error);
    throw error;
  }
}

async function listMedications(): Promise<MedicationDocument[]> {
  try {
    const userId = await getCurrentUserId();
    const response = await databases.listDocuments(
      config.databaseId,
      config.medicationsCollectionId,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt')
      ]
    );
    return response.documents as MedicationDocument[];
  } catch (error) {
    console.error('Error listing medications:', error);
    throw error;
  }
}

async function updateMedication(medicationId: string, data: Partial<MedicationDocument>) {
  try {
    const medication = await databases.updateDocument(
      config.databaseId,
      config.medicationsCollectionId,
      medicationId,
      data
    );
    return medication;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
}

// Appointment helpers
async function createAppointment(data: Omit<AppointmentDocument, '$id' | 'userId' | 'createdAt'>) {
  try {
    const userId = await getCurrentUserId();
    const appointment = await databases.createDocument(
      config.databaseId,
      config.appointmentsCollectionId,
      ID.unique(),
      {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
      }
    );
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

async function listAppointments(): Promise<AppointmentDocument[]> {
  try {
    const userId = await getCurrentUserId();
    const response = await databases.listDocuments(
      config.databaseId,
      config.appointmentsCollectionId,
      [
        Query.equal('userId', userId),
        Query.orderAsc('date')
      ]
    );
    return response.documents as AppointmentDocument[];
  } catch (error) {
    console.error('Error listing appointments:', error);
    throw error;
  }
}

async function updateAppointment(appointmentId: string, data: Partial<AppointmentDocument>) {
  try {
    const appointment = await databases.updateDocument(
      config.databaseId,
      config.appointmentsCollectionId,
      appointmentId,
      data
    );
    return appointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export {
  client,
  account,
  storage,
  databases,
  uploadFile,
  createFolder,
  listFiles,
  downloadFile,
  deleteFile,
  createMedication,
  listMedications,
  updateMedication,
  createAppointment,
  listAppointments,
  updateAppointment
};
