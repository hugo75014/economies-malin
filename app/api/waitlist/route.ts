import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type WaitlistEntry = {
  email: string;
  audience: 'particulier' | 'entrepreneur';
  answers?: Record<string, string>;
  planTotalSavings?: number;
  source?: string;
  createdAt: string;
};

// In-memory fallback when filesystem writes fail
const memoryStore: WaitlistEntry[] = [];

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'waitlist.json');

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

async function persist(entry: WaitlistEntry) {
  try {
    await ensureFile();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const arr: WaitlistEntry[] = JSON.parse(raw);
    arr.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    return { mode: 'file' as const };
  } catch (err) {
    memoryStore.push(entry);
    return { mode: 'memory' as const };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, audience, answers, planTotalSavings, source } = body ?? {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Email invalide' },
        { status: 400 },
      );
    }

    if (audience && !['particulier', 'entrepreneur'].includes(audience)) {
      return NextResponse.json(
        { ok: false, error: 'Audience invalide' },
        { status: 400 },
      );
    }

    const entry: WaitlistEntry = {
      email: email.trim().toLowerCase(),
      audience: audience ?? 'particulier',
      answers: answers ?? undefined,
      planTotalSavings: typeof planTotalSavings === 'number' ? planTotalSavings : undefined,
      source: source ?? 'unknown',
      createdAt: new Date().toISOString(),
    };

    const { mode } = await persist(entry);

    // Optional: forward to Resend for transactional email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL ?? 'hello@economies-malin.fr',
            to: entry.email,
            subject: 'Ton plan d\'économies — Économies Malin',
            html: `<h1>Merci !</h1><p>Ton plan personnalisé t'attend.</p>`,
          }),
        });
      } catch (e) {
        // tolerate
      }
    }

    return NextResponse.json({ ok: true, mode });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Bad request' },
      { status: 400 },
    );
  }
}

export async function GET() {
  // Admin endpoint to read waitlist — for v0.1 debug only. Lock down in prod.
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return new NextResponse(raw, { headers: { 'Content-Type': 'application/json' } });
  } catch {
    return NextResponse.json({ count: memoryStore.length, entries: memoryStore });
  }
}
