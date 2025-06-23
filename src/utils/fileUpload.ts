
import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadFile = async (
  file: File | Blob, 
  fileName: string, 
  bucket: 'photos' | 'audio' | 'documents'
): Promise<UploadResult> => {
  const fileExt = fileName.split('.').pop();
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `complaints/${uniqueFileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path
  };
};

export const deleteFile = async (path: string, bucket: 'photos' | 'audio' | 'documents') => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

export const getFileUrl = (path: string, bucket: 'photos' | 'audio' | 'documents') => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};
