import env from '#start/env';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: env.get('CLOUDINARY_NAME'), 
  api_key: env.get('CLOUDINARY_API_KEY'), 
  api_secret: env.get('CLOUDINARY_API_SECRET'),
//   secure_distribution: 'mydomain.com',
//   upload_prefix: 'https://api-eu.cloudinary.com'
});
