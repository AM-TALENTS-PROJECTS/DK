import * as fs from 'fs';
import * as path from 'path';

function firstExistingPath(candidates: string[]): string {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

export function resolveFrontendDir(): string {
  const envFrontendDir = process.env.FRONTEND_DIR;

  const candidates = [
    envFrontendDir || '',
    path.join(process.cwd(), 'frontend'),
    path.resolve(__dirname, '../../frontend'),
    path.resolve(process.cwd(), 'dist/frontend'),
  ].filter(Boolean);

  return firstExistingPath(candidates);
}

export function resolveRootFile(filename: string): string {
  const candidates = [
    path.join(process.cwd(), filename),
    path.resolve(__dirname, `../../${filename}`),
    path.resolve(process.cwd(), `dist/${filename}`),
  ];

  return firstExistingPath(candidates);
}
