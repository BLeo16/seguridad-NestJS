import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'products' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            uploadStream.end(file.buffer);
        });
    }

    async deleteImage(url: string): Promise<void> {
        const publicId = this.extractPublicId(url);
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private extractPublicId(url: string): string {
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
        const parts = url.split('/');
        const uploadIndex = parts.findIndex(part => part === 'upload');
        const publicIdWithExt = parts.slice(uploadIndex + 2).join('/'); // from version onwards
        return publicIdWithExt.split('.')[0]; // remove extension
    }
}
