import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log request
  console.log(`📥 ${req.method} ${req.url} - ${req.ip}`);

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk: any, encoding?: any) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    let statusEmoji = '✅';
    if (statusCode >= 400 && statusCode < 500) {
      statusEmoji = '⚠️';
    } else if (statusCode >= 500) {
      statusEmoji = '❌';
    }

    console.log(`📤 ${req.method} ${req.url} - ${statusCode} ${statusEmoji} - ${duration}ms`);
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
}