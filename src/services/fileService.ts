import { apiClient } from './api';

export interface UploadedFile {
  _id: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileService {
  // Upload a single file
  async uploadFile(
    file: File, 
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    // Create XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: FileUploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data);
          } catch (error) {
            reject(new Error('Invalid server response'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || 'Upload failed'));
          } catch {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Set up the request
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Start the upload
      xhr.open('POST', `http://localhost:3000/api/files/upload`);
      xhr.send(formData);
    });
  }

  // Upload multiple files
  async uploadFiles(
    files: FileList | File[], 
    onProgress?: (fileIndex: number, progress: FileUploadProgress) => void
  ): Promise<UploadedFile[]> {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map((file, index) => 
      this.uploadFile(file, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      })
    );

    return Promise.all(uploadPromises);
  }

  // Upload tender documents
  async uploadTenderDocuments(
    tenderId: string,
    files: FileList | File[],
    onProgress?: (fileIndex: number, progress: FileUploadProgress) => void
  ): Promise<UploadedFile[]> {
    const fileArray = Array.from(files);
    const formData = new FormData();
    
    fileArray.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append('tenderId', tenderId);

    // For tender documents, we'll use the apiClient upload method
    // but enhance it with progress tracking for multiple files
    const uploadPromises = fileArray.map(async (file, index) => {
      const singleFormData = new FormData();
      singleFormData.append('file', file);
      singleFormData.append('tenderId', tenderId);

      return new Promise<UploadedFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress: FileUploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(index, progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.data);
            } catch (error) {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.message || 'Upload failed'));
            } catch {
              reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        const token = localStorage.getItem('auth_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.open('POST', `http://localhost:3000/api/files/tender/${tenderId}/upload`);
        xhr.send(singleFormData);
      });
    });

    return Promise.all(uploadPromises);
  }

  // Upload profile picture
  async uploadProfilePicture(
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('profile', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: FileUploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data);
          } catch (error) {
            reject(new Error('Invalid server response'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || 'Upload failed'));
          } catch {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.open('POST', `http://localhost:3000/api/files/profile/upload`);
      xhr.send(formData);
    });
  }

  // Delete a file
  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`/files/${fileId}`);
  }

  // Get file info
  async getFile(fileId: string): Promise<UploadedFile> {
    const response = await apiClient.get<{ file: UploadedFile }>(`/files/${fileId}`);
    return response.data!.file;
  }

  // Get download URL
  getDownloadUrl(fileId: string): string {
    return `http://localhost:3000/api/files/download/${fileId}`;
  }

  // Get file preview URL (for images)
  getPreviewUrl(fileId: string, size: 'thumbnail' | 'small' | 'medium' = 'small'): string {
    return `http://localhost:3000/api/files/preview/${fileId}?size=${size}`;
  }

  // Validate file before upload
  validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { valid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = [],
      allowedExtensions = []
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return {
          valid: false,
          error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
        };
      }
    }

    return { valid: true };
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file type icon
  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': return '🖼️';
      case 'zip': case 'rar': case '7z': return '📦';
      case 'txt': return '📄';
      default: return '📎';
    }
  }
}

export const fileService = new FileService();