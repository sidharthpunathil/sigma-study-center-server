import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ref, uploadBytesResumable, getDownloadURL, StorageReference, getStream } from '@firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

@Injectable()
export class StorageService {

    private storage;

    constructor(private readonly configService: ConfigService) {

        const firebaseConfig = {
            apiKey: this.configService.get<string>('Firebase.apiKey'),
            authDomain: this.configService.get<string>('Firebase.authDomain'),
            projectId: this.configService.get<string>('Firebase.projectId'),
            storageBucket: this.configService.get<string>('Firebase.storageBucket'),
            messagingSenderId: this.configService.get<string>('Firebase.messagingSenderId'),
            appId: this.configService.get<string>('Firebase.appId'),
            measurementId: this.configService.get<string>('Firebase.measurementId'),
        };


        const app = initializeApp(firebaseConfig);
        this.storage = getStorage(app);
    }


    async uploadFile(file: Express.Multer.File): Promise<string> {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Allowed types: PDF, JPEG, PNG.');
        }

        const newId = uuidv4();

        const metadata = {
            contentType: file.mimetype,
        };

        const storagePath = `sigma-study-center/${newId}`;
        const storageRef: StorageReference = ref(this.storage, storagePath);

        try {
            await uploadBytesResumable(storageRef, file.buffer, metadata);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File uploaded successfully. Download URL:', downloadURL);
            console.log('FileId', newId);
            return newId;
        } catch (error) {
            console.log(error)
            throw new ServiceUnavailableException('File upload failed');
        }
    }

    async getFileUrlById(uuid: string): Promise<string> {
        const storagePath = `sigma-study-center/${uuid}`;
        const storageRef: StorageReference = ref(this.storage, storagePath);

        try {
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File URL retrieved successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Error retrieving file URL:', error);
            throw new NotFoundException('File not found')
        }
    }

    async getFileAsBuffer(uuid: string): Promise<Buffer> {
        const storagePath = `sigma-study-center/${uuid}`;
        const storageRef: StorageReference = ref(this.storage, storagePath);
    
        try {
          const downloadURL = await getDownloadURL(storageRef);
          const response = await axios.get(downloadURL, { responseType: 'arraybuffer' });
          return Buffer.from(response.data, 'binary');
        } catch (error) {
          console.error('Error retrieving file as buffer:', error);
          throw new Error('File retrieval as buffer failed.');
        }
      }


      async getFileAsBase64(uuid: string): Promise<string> {
        const storagePath = `sigma-study-center/${uuid}`;
        const storageRef: StorageReference = ref(this.storage, storagePath);
    
        try {
          const downloadURL = await getDownloadURL(storageRef);
          const response = await axios.get(downloadURL, { responseType: 'arraybuffer' });
    
          const buffer = Buffer.from(response.data, 'binary');
          const base64String = buffer.toString('base64');
          
          return base64String;
        } catch (error) {
          console.error('Error retrieving file as base64:', error);
          throw new Error('File retrieval as base64 failed.');
        }
      }
}
