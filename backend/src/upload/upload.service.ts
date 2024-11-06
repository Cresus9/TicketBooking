import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { extname } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    await this.validateFile(file);
    
    const hashedFilename = this.generateHashedFilename(file.originalname);
    const filePath = `${this.uploadDir}/${hashedFilename}`;
    
    await this.ensureUploadDir();
    await fs.writeFile(filePath, file.buffer);
    
    return hashedFilename;
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = `${this.uploadDir}/${filename}`;
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }
  }

  private generateHashedFilename(originalname: string): string {
    const timestamp = Date.now();
    const hash = createHash('sha256')
      .update(`${originalname}${timestamp}`)
      .digest('hex')
      .substring(0, 16);
    const ext = extname(originalname);
    return `${hash}${ext}`;
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }
}