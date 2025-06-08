import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      this.logger.error('No file received');
      throw new Error('No file received');
    }

    this.logger.log(`File uploaded: ${file.originalname}`);
    return { 
      message: 'File uploaded successfully', 
      filename: file.originalname,
      size: file.size
    };
  }
}