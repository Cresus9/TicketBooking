import api from './api';

class UploadService {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.filename;
  }

  async deleteFile(filename: string): Promise<void> {
    await api.delete(`/upload/${filename}`);
  }

  getFileUrl(filename: string): string {
    return `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit',
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Allowed types: JPG, PNG, GIF, WebP, PDF',
      };
    }

    return { valid: true };
  }
}