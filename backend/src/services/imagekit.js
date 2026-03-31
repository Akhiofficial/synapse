import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

let imagekit;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  console.log('[ImageKit] Service initialized successfully.');
} else {
  console.warn('[ImageKit] Warning: Missing ImageKit credentials in .env');
}

export default imagekit;
