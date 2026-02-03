import { supabase } from '../supabase';

// Resize image client-side using canvas to limit size before upload
export const resizeImageFile = (file, maxWidth = 1024, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(new File([blob], file.name, { type: blob.type }));
            else reject(new Error('Failed to convert canvas to blob'));
          },
          file.type || 'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadImageFile = (uid, file, bucket = 'attachments') => {
  return new Promise(async (resolve, reject) => {
    try {
      const compressed = await resizeImageFile(file, 1200, 0.77);
      const filePath = `${bucket}/${uid}/${Date.now()}_${compressed.name}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressed, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        reject(error);
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        resolve(urlData.publicUrl);
      }
    } catch (err) {
      reject(err);
    }
  });
};
