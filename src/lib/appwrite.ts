import { Client, Account, Storage, Databases, ID, Query, Models } from "appwrite";

export interface FileDocument extends Models.Document {
  name: string;
  type: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  fieldId?: string;
  mimeType?: string;
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
  speciality: string;  // Fixed spelling to match Appwrite collection
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
    const userId = await getCurrentUserId();

    // Upload file to storage
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );

    // Create file metadata in database with storage details
    const fileMetadata = await databases.createDocument(
      config.databaseId,
      config.filesCollectionId,
      ID.unique(),
      {
        name: file.name,
        type: "file",
        userId: userId,
        parentId: parentId,
        createdAt: new Date().toISOString(),
        fieldId: uploadedFile.$id,
        storageId: config.storageId, // Explicitly set storage bucket ID
        mimeType: file.type,
        size: file.size // Include file size
      }
    );

    console.log('Created file metadata:', {
      name: file.name,
      parentId: parentId,
      fieldId: uploadedFile.$id,
      storageId: config.storageId
    });

    // Return the file metadata document instead of just the storage file
    return fileMetadata;
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
async function listFiles(parentId: string | null = null): Promise<FileDocument[]> {
  try {
    const userId = await getCurrentUserId();
    
    // Build query array
    const queries = [
      // Query for the current user's files
      Query.equal('userId', userId),
      // Order by type first (folders before files) then by name
      Query.orderDesc('type'),
      Query.orderAsc('name')
    ];

    // Add parentId filter
    if (parentId === null) {
      queries.push(Query.isNull('parentId'));
    } else {
      queries.push(Query.equal('parentId', parentId));
    }

    const response = await databases.listDocuments(
      config.databaseId,
      config.filesCollectionId,
      queries
    );
    
    return response.documents as FileDocument[];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Download file helper
async function downloadFile(fileDocument: FileDocument) {
  try {
    if (!fileDocument.fieldId) {
      throw new Error('Field ID not found');
    }

    // Get the file URL
    const result = await storage.getFileView(
      config.storageId,
      fileDocument.fieldId
    );

    return result;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

// Delete file helper
async function deleteFile(fileDocument: FileDocument) {
  try {
    // Delete file from storage if it's a file (not a folder)
    if (fileDocument.type === 'file' && fileDocument.fieldId) {
      await storage.deleteFile(
        config.storageId,
        fileDocument.fieldId
      );
    }

    // Delete the document from database
    await databases.deleteDocument(
      config.databaseId,
      config.filesCollectionId,
      fileDocument.$id
    );

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

