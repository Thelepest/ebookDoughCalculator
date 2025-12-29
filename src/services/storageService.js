import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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

export const uploadImageFile = (uid, file, path = 'attachments') => {
  return new Promise(async (resolve, reject) => {
    try {
      const compressed = await resizeImageFile(file, 1200, 0.77);
      const storageRef = ref(storage, `${path}/${uid}/${Date.now()}_${compressed.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressed);
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
