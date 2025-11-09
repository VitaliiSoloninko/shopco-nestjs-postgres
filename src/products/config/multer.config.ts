import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/products',
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      const ext = extname(file.originalname);
      const filename = `product-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return callback(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};

export const imageFileFilter = (req: any, file: any, callback: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  callback(null, true);
};
