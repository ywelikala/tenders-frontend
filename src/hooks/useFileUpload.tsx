import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService, type UploadedFile, type FileUploadProgress } from '../services/fileService';
import { useToast } from './use-toast';

interface FileUploadState {
  isUploading: boolean;
  progress: number;
  uploadedFiles: UploadedFile[];
  error: string | null;
}

interface UseFileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  onSuccess?: (files: UploadedFile[]) => void;
  onError?: (error: Error) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    uploadedFiles: [],
    error: null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      
      // Validate files
      for (const file of fileArray) {
        const validation = fileService.validateFile(file, {
          maxSize: options.maxSize,
          allowedTypes: options.allowedTypes,
          allowedExtensions: options.allowedExtensions,
        });
        
        if (!validation.valid) {
          throw new Error(`${file.name}: ${validation.error}`);
        }
      }

      setUploadState(prev => ({ ...prev, isUploading: true, error: null }));
      
      const uploadedFiles: UploadedFile[] = [];
      let totalProgress = 0;
      const fileCount = fileArray.length;
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        try {
          const uploadedFile = await fileService.uploadFile(file, (progress) => {
            const fileProgress = progress.percentage / fileCount;
            const overallProgress = totalProgress + fileProgress;
            setUploadState(prev => ({ ...prev, progress: Math.round(overallProgress) }));
          });
          
          uploadedFiles.push(uploadedFile);
          totalProgress += 100 / fileCount;
          
          setUploadState(prev => ({ 
            ...prev, 
            progress: Math.round(totalProgress),
            uploadedFiles: [...prev.uploadedFiles, uploadedFile]
          }));
        } catch (error) {
          throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      return uploadedFiles;
    },
    onSuccess: (files) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        progress: 100 
      }));
      
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${files.length} file(s)`,
      });
      
      options.onSuccess?.(files);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
      
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      
      options.onError?.(error);
    },
  });

  const uploadFiles = (files: FileList | File[]) => {
    uploadMutation.mutate(files);
  };

  const reset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      uploadedFiles: [],
      error: null,
    });
  };

  return {
    ...uploadState,
    uploadFiles,
    reset,
    isError: uploadMutation.isError,
  };
};

// Hook for tender document uploads
export const useTenderDocumentUpload = (tenderId: string, options: UseFileUploadOptions = {}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    uploadedFiles: [],
    error: null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      
      // Validate files
      for (const file of fileArray) {
        const validation = fileService.validateFile(file, {
          maxSize: options.maxSize || 50 * 1024 * 1024, // 50MB for tender documents
          allowedTypes: options.allowedTypes || [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ],
          allowedExtensions: options.allowedExtensions || ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
        });
        
        if (!validation.valid) {
          throw new Error(`${file.name}: ${validation.error}`);
        }
      }

      setUploadState(prev => ({ ...prev, isUploading: true, error: null, progress: 0 }));
      
      return fileService.uploadTenderDocuments(tenderId, files, (fileIndex, progress) => {
        const overallProgress = ((fileIndex + (progress.percentage / 100)) / fileArray.length) * 100;
        setUploadState(prev => ({ ...prev, progress: Math.round(overallProgress) }));
      });
    },
    onSuccess: (files) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        progress: 100,
        uploadedFiles: files
      }));
      
      toast({
        title: "Documents Uploaded",
        description: `Successfully uploaded ${files.length} document(s) to tender`,
      });
      
      options.onSuccess?.(files);
      
      // Invalidate tender and file queries
      queryClient.invalidateQueries({ queryKey: ['tenders', tenderId] });
      queryClient.invalidateQueries({ queryKey: ['tender-documents', tenderId] });
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
      
      toast({
        title: "Document Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      
      options.onError?.(error);
    },
  });

  const uploadDocuments = (files: FileList | File[]) => {
    uploadMutation.mutate(files);
  };

  const reset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      uploadedFiles: [],
      error: null,
    });
  };

  return {
    ...uploadState,
    uploadDocuments,
    reset,
    isError: uploadMutation.isError,
  };
};

// Hook for profile picture upload
export const useProfilePictureUpload = (options: UseFileUploadOptions = {}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    uploadedFiles: [],
    error: null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Validate file
      const validation = fileService.validateFile(file, {
        maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB for profile pictures
        allowedTypes: options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif'],
        allowedExtensions: options.allowedExtensions || ['jpg', 'jpeg', 'png', 'gif'],
      });
      
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setUploadState(prev => ({ ...prev, isUploading: true, error: null, progress: 0 }));
      
      return fileService.uploadProfilePicture(file, (progress) => {
        setUploadState(prev => ({ ...prev, progress: progress.percentage }));
      });
    },
    onSuccess: (file) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        progress: 100,
        uploadedFiles: [file]
      }));
      
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated",
      });
      
      options.onSuccess?.([file]);
      
      // Invalidate user profile queries
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: Error) => {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message 
      }));
      
      toast({
        title: "Profile Picture Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      
      options.onError?.(error);
    },
  });

  const uploadProfilePicture = (file: File) => {
    uploadMutation.mutate(file);
  };

  const reset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      uploadedFiles: [],
      error: null,
    });
  };

  return {
    ...uploadState,
    uploadProfilePicture,
    reset,
    isError: uploadMutation.isError,
  };
};