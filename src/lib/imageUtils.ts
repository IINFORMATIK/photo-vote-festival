
export const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 1200px width/height while maintaining aspect ratio)
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;
        
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); // Compress with 80% quality
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const getCompressedImageUrl = (originalUrl: string): string => {
  if (originalUrl.includes('data:image')) {
    return originalUrl; // Already a base64 image
  }
  
  // Ensure the URL starts with /uploads/ for proper nginx routing
  if (!originalUrl.startsWith('/uploads/') && !originalUrl.startsWith('http')) {
    return `/uploads/${originalUrl.replace(/^\/+/, '')}`;
  }
  
  return originalUrl;
};
