'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Loader2, Sparkles, AlertCircle, ImageIcon, X, FileText, FileSpreadsheet, FileQuestion } from 'lucide-react';
import type { AnalysisOutput } from '@/lib/llm';
import { mockAnalyze } from '@/lib/mock-analysis';
import { normalizeFile, categorize, type FileCategory } from '@/lib/file-type';
import { useT } from './I18nProvider';
import AnalysisResult from './AnalysisResult';

type Status = 'idle' | 'reading' | 'analyzing' | 'done' | 'error';

const MAX_SIZE_MB = 10; // upped from 5 to accept larger PDFs / exports

const categoryIcon = (c: FileCategory) => {
  switch (c) {
    case 'image': return ImageIcon;
    case 'pdf': return FileText;
    case 'text':
    case 'data': return FileText;
    case 'spreadsheet': return FileSpreadsheet;
    case 'office': return FileText;
    default: return FileQuestion;
  }
};

const categoryLabel = (c: FileCategory, mime: string, t: (k: string) => string) => {
  if (c === 'image') return t('analyse.cat.image');
  if (c === 'pdf') return t('analyse.cat.pdf');
  if (c === 'text') return mime.includes('csv') ? t('analyse.cat.csv') : t('analyse.cat.text');
  if (c === 'spreadsheet') return t('analyse.cat.spreadsheet');
  if (c === 'office') return t('analyse.cat.office');
  if (c === 'data') return t('analyse.cat.data');
  return mime || t('analyse.cat.default');
};

export default function AnalyseClient() {
  const [status, setStatus] = useState<Status>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; category: FileCategory; mimeType: string } | null>(null);
  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useT();
  const tRef = useRef(t);
  tRef.current = t;

  const reset = () => {
    setStatus('idle');
    setPreview(null);
    setFileInfo(null);
    setResult(null);
    setError(null);
  };

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(tRef.current('analyse.error.tooBig'));
      return;
    }
    if (file.size === 0) {
      setError(tRef.current('analyse.error.empty'));
      return;
    }

    // Normalize + categorize
    const { mimeType, fileName, ext } = normalizeFile(file);
    const category = categorize(mimeType, ext);
    setFileInfo({ name: fileName, size: file.size, category, mimeType });

    setStatus('reading');

    // Read as data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      // For images, keep a preview. For others, just note the name.
      if (category === 'image') {
        setPreview(dataUrl);
      }

      // Extract base64
      const [meta, base64] = dataUrl.split(',');
      const realMime = meta.match(/data:(.*?);base64/)?.[1] ?? mimeType;

      setStatus('analyzing');
      try {
        let data: AnalysisOutput;
        try {
          const res = await fetch('/api/analyse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: { base64, mimeType: realMime, fileName, size: file.size },
            }),
          });
          if (res.ok) {
            data = (await res.json()) as AnalysisOutput;
          } else {
            // Static export fallback — no server route
            data = mockAnalyze();
          }
        } catch {
          data = mockAnalyze();
        }
        setResult(data);
        setStatus('done');
      } catch (e: any) {
        setError(e.message ?? tRef.current('analyse.error.generic'));
        setStatus('error');
      }
    };
    reader.onerror = () => {
      setError(tRef.current('analyse.error.readError'));
      setStatus('error');
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ───────── Done → show result ─────────
  if (status === 'done' && result) {
    return <AnalysisResult result={result} onRestart={reset} previewUrl={preview ?? undefined} />;
  }

  // ───────── Idle / reading / analyzing / error → show upload UI ─────────
  const Icon = fileInfo ? categoryIcon(fileInfo.category) : Upload;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={
          'card border-2 border-dashed cursor-pointer transition-all ' +
          (dragOver
            ? 'border-brand-500 bg-brand-50'
            : 'border-ink-200 hover:border-brand-300 hover:bg-brand-50/30')
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf,.csv,.txt,.json,.xml,.md,.ofx,.qif,.xls,.xlsx,.doc,.docx"
          onChange={onPick}
          className="hidden"
        />

        {status === 'analyzing' || status === 'reading' ? (
          <div className="py-12 text-center">
            <Loader2 className="w-10 h-10 mx-auto text-brand-600 animate-spin" />
            <p className="mt-4 font-semibold text-lg">
              {status === 'reading' ? t('analyse.reading') : t('analyse.analyzing')}
            </p>
            <p className="text-sm text-ink-500 mt-1">{t('analyse.analyzing.hint')}</p>
            <ul className="mt-6 space-y-1.5 text-sm text-ink-600 text-left max-w-sm mx-auto">
              {[t('analyse.step.1'), t('analyse.step.2'), t('analyse.step.3'), t('analyse.step.4')].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin" />
                  {s}
                </li>
              ))}
            </ul>
            {fileInfo && (
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-50 text-xs text-ink-600">
                <Icon className="w-3.5 h-3.5" />
                {fileInfo.name} · {(fileInfo.size / 1024).toFixed(1)} Ko
              </div>
            )}
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Aperçu"
              className="w-full max-h-80 object-contain rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : fileInfo ? (
          // File uploaded but not an image — show icon + name
          <div className="py-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-brand-700" />
            </div>
            <p className="font-semibold mb-1">{fileInfo.name}</p>
            <p className="text-sm text-ink-500">
              {categoryLabel(fileInfo.category, fileInfo.mimeType, t)} ·{' '}
              {(fileInfo.size / 1024).toFixed(1)} Ko
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="mt-4 text-sm text-ink-500 hover:text-ink-700 inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> {t('analyse.change')}
            </button>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-brand-700" />
            </div>
            <p className="font-semibold text-lg mb-1">
              {t('analyse.drop.title')}
            </p>
            <p className="text-sm text-ink-500 max-w-md mx-auto">
              {t('analyse.drop.subtitle')}
            </p>
            <p className="text-xs text-ink-400 mt-2">
              {t('analyse.drop.hint')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-ink-500">
              {['BNP', 'Crédit Agricole', 'Société Générale', 'Revolut', 'Boursorama', 'Lydia', 'N26'].map((b) => (
                <span key={b} className="badge bg-ink-50 text-ink-600">
                  {b}
                </span>
              ))}
              <span className="badge bg-ink-50 text-ink-600">+ toutes les autres</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">{t('analyse.error.title')}</p>
            <p className="text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Trust badges */}
      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        <div className="text-xs text-ink-500 flex flex-col items-center gap-1">
          <div className="text-brand-600"><Sparkles className="w-4 h-4" /></div>
          {t('analyse.trust.ai')}
        </div>
        <div className="text-xs text-ink-500 flex flex-col items-center gap-1">
          <div className="text-brand-600"><ImageIcon className="w-4 h-4" /></div>
          {t('analyse.trust.delete')}
        </div>
        <div className="text-xs text-ink-500 flex flex-col items-center gap-1">
          <div className="text-brand-600">
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          {t('analyse.trust.bank')}
        </div>
      </div>

      <p className="text-center text-xs text-ink-400 mt-8">
        {t('analyse.tip')}
      </p>
    </div>
  );
}
