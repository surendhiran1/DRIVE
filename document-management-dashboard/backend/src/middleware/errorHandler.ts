import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File size limit exceeded. Maximum file size is 25MB.'
    });
  }

  if (err.message && err.message.includes('Only PDF files are allowed!')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};
