import { NextResponse } from 'next/server';
import { analyzeFile } from '@/lib/llm';
import { normalizeFile, categorize, isTextReadable } from '@/lib/file-type';

// Server route — disabled in static export. Works in Vercel/production deploys.

export const runtime = 'nodejs';
export const maxDuration = 30; // 30s — LLM call can be slow

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file } = body ?? {};

    if (!file || typeof file !== 'object') {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }
    const { base64, mimeType, fileName, size } = file;

    if (!base64 || typeof base64 !== 'string') {
      return NextResponse.json({ error: 'Base64 du fichier manquant' }, { status: 400 });
    }
    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ error: 'Nom de fichier manquant' }, { status: 400 });
    }

    // Strip data URL prefix if present
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    // Re-derive MIME from extension if missing/weird
    const fakeFile = {
      name: fileName,
      type: mimeType,
      size: size ?? Math.floor((cleanBase64.length * 3) / 4),
    } as File;
    const norm = normalizeFile(fakeFile);
    const category = categorize(norm.mimeType, norm.ext);
    const detectedSize = fakeFile.size;

    if (detectedSize > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10 Mo). Compresse-le ou extrais un mois.' },
        { status: 413 },
      );
    }

    // Reject truly empty / corrupt files
    if (cleanBase64.length < 100) {
      return NextResponse.json(
        { error: 'Le fichier semble vide ou corrompu.' },
        { status: 400 },
      );
    }

    const result = await analyzeFile({
      base64: cleanBase64,
      mimeType: norm.mimeType,
      fileName,
      size: detectedSize,
    });

    return NextResponse.json({
      ...result,
      fileInfo: {
        name: fileName,
        mimeType: norm.mimeType,
        category,
        size: detectedSize,
        textReadable: isTextReadable(norm.mimeType, norm.ext),
      },
    });
  } catch (err: any) {
    console.error('[/api/analyse] error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Erreur serveur' },
      { status: 500 },
    );
  }
}
