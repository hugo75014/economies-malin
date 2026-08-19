// LLM abstraction — multi-provider with mock fallback
// Supports images, PDFs, text files, CSVs, etc.

import { buildAnalysisPrompt } from './analysis-prompt';
import { mockAnalyze } from './mock-analysis';

export type FileInput = {
  base64: string;
  mimeType: string;
  fileName: string;
  size: number;
};

export type AnalysisOutput = {
  summary: string;
  transactions: Array<{
    date: string;
    label: string;
    amount: number;
    category: string;
  }>;
  recurring: Array<{
    name: string;
    monthlyAmount: number;
    note: string;
  }>;
  unusualFees: Array<{
    label: string;
    amount: number;
    why: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    estimatedAnnualSavings: number;
    effort: 'facile' | 'moyen' | 'avance';
    action: string;
    href: string;
    emoji: string;
  }>;
  totalEstimatedSavings: number;
  detectedFileType?: string;
  detectedBankName?: string;
};

export type LLMProvider = 'openai' | 'anthropic' | 'groq' | 'mock';

function getProvider(): LLMProvider {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return 'mock';
}

export async function analyzeFile(file: FileInput): Promise<AnalysisOutput> {
  const provider = getProvider();
  const { system, user } = buildAnalysisPrompt({ fileName: file.fileName, mimeType: file.mimeType });

  if (provider === 'mock') {
    return { ...mockAnalyze(), detectedFileType: file.mimeType };
  }

  if (provider === 'openai') {
    return callOpenAI(system, user, file);
  }

  if (provider === 'groq') {
    return callGroq(system, user, file);
  }

  if (provider === 'anthropic') {
    return callAnthropic(system, user, file);
  }

  return mockAnalyze();
}

async function callOpenAI(system: string, user: string, file: FileInput): Promise<AnalysisOutput> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const isImage = file.mimeType.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';
  const dataUrl = `data:${file.mimeType};base64,${file.base64}`;

  let userContent: any;

  if (isImage) {
    userContent = [
      { type: 'text', text: user },
      { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
    ];
  } else if (isPdf) {
    // OpenAI gpt-4o supports PDFs via the 'file' content type (newer API)
    userContent = [
      { type: 'text', text: user },
      {
        type: 'file',
        file: {
          filename: file.fileName,
          file_data: dataUrl,
        },
      },
    ];
  } else {
    // Text or other — embed in text prompt
    let textContent = '';
    if (file.mimeType.startsWith('text/') || /\.(csv|json|xml|md|txt|qif|ofx)$/i.test(file.fileName)) {
      try {
        const decoded = Buffer.from(file.base64, 'base64').toString('utf-8');
        textContent = `\n\n--- Contenu du fichier "${file.fileName}" (${(file.size / 1024).toFixed(1)} Ko) ---\n${decoded.slice(0, 80000)}${decoded.length > 80000 ? '\n\n[…tronqué…]' : ''}`;
      } catch (e) {
        textContent = `\n\n[Fichier "${file.fileName}" - binaire non décodable, type: ${file.mimeType}]`;
      }
    } else {
      textContent = `\n\n[Fichier "${file.fileName}" reçu, type: ${file.mimeType}, taille: ${(file.size / 1024).toFixed(1)} Ko. Indique que tu ne peux pas le lire directement.]`;
    }
    userContent = user + textContent;
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Réponse OpenAI vide');

  return { ...parseAndValidate(JSON.parse(content)), detectedFileType: file.mimeType };
}

async function callGroq(system: string, user: string, file: FileInput): Promise<AnalysisOutput> {
  const apiKey = process.env.GROQ_API_KEY!;
  // Default: Llama 3.2 90B Vision (best multimodal on Groq)
  const model = process.env.GROQ_MODEL || 'llama-3.2-90b-vision-preview';

  const isImage = file.mimeType.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';
  const dataUrl = `data:${file.mimeType};base64,${file.base64}`;

  let userContent: any;

  if (isImage) {
    // Groq vision models accept OpenAI-style image_url content
    userContent = [
      { type: 'text', text: user },
      { type: 'image_url', image_url: { url: dataUrl } },
    ];
  } else if (isPdf) {
    // Groq doesn't natively handle PDFs — extract text and pass as text
    try {
      const decoded = Buffer.from(file.base64, 'base64').toString('utf-8');
      const cleaned = decoded.replace(/[^\x20-\x7E\n]/g, ' ').slice(0, 60000);
      userContent = `${user}\n\n--- Contenu du PDF "${file.fileName}" ---\n${cleaned}`;
    } catch {
      userContent = `${user}\n\n[PDF "${file.fileName}" reçu mais non lisible directement]`;
    }
  } else {
    // Text or other
    if (file.mimeType.startsWith('text/') || /\.(csv|json|xml|md|txt|qif|ofx)$/i.test(file.fileName)) {
      try {
        const decoded = Buffer.from(file.base64, 'base64').toString('utf-8');
        userContent = `${user}\n\n--- Contenu de "${file.fileName}" (${(file.size / 1024).toFixed(1)} Ko) ---\n${decoded.slice(0, 60000)}${decoded.length > 60000 ? '\n\n[…tronqué…]' : ''}`;
      } catch {
        userContent = `${user}\n\n[Fichier "${file.fileName}" non décodable, type: ${file.mimeType}]`;
      }
    } else {
      userContent = `${user}\n\n[Fichier "${file.fileName}" reçu, type: ${file.mimeType}. Indique que tu ne peux pas le lire.]`;
    }
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Réponse Groq vide');

  return { ...parseAndValidate(JSON.parse(content)), detectedFileType: file.mimeType };
}

async function callAnthropic(system: string, user: string, file: FileInput): Promise<AnalysisOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

  const isImage = file.mimeType.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';

  let userContent: any[] = [];

  if (isImage) {
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: file.mimeType as any, data: file.base64 },
    });
  } else if (isPdf) {
    userContent.push({
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: file.base64 },
    });
  } else if (file.mimeType.startsWith('text/') || /\.(csv|json|xml|md|txt|qif|ofx)$/i.test(file.fileName)) {
    try {
      const decoded = Buffer.from(file.base64, 'base64').toString('utf-8');
      userContent.push({
        type: 'text',
        text: `[Fichier "${file.fileName}" - ${(file.size / 1024).toFixed(1)} Ko]\n\n${decoded.slice(0, 80000)}${decoded.length > 80000 ? '\n\n[…tronqué…]' : ''}`,
      });
    } catch {
      userContent.push({ type: 'text', text: `[Fichier "${file.fileName}" non décodable]` });
    }
  } else {
    userContent.push({ type: 'text', text: `[Fichier "${file.fileName}" - type: ${file.mimeType}, taille: ${(file.size / 1024).toFixed(1)} Ko. Ne peux pas le lire directement.]` });
  }

  userContent.push({ type: 'text', text: user });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text;
  if (!content) throw new Error('Réponse Anthropic vide');

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Pas de JSON dans la réponse Anthropic');
  return { ...parseAndValidate(JSON.parse(jsonMatch[0])), detectedFileType: file.mimeType };
}

function parseAndValidate(raw: any): AnalysisOutput {
  return {
    summary: typeof raw.summary === 'string' ? raw.summary : 'Analyse terminée.',
    transactions: Array.isArray(raw.transactions) ? raw.transactions.slice(0, 50) : [],
    recurring: Array.isArray(raw.recurring) ? raw.recurring.slice(0, 20) : [],
    unusualFees: Array.isArray(raw.unusualFees) ? raw.unusualFees.slice(0, 10) : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations.slice(0, 5) : [],
    totalEstimatedSavings:
      typeof raw.totalEstimatedSavings === 'number'
        ? raw.totalEstimatedSavings
        : Array.isArray(raw.recommendations)
        ? raw.recommendations.reduce(
            (s: number, r: any) => s + (Number(r.estimatedAnnualSavings) || 0),
            0,
          )
        : 0,
    detectedBankName: typeof raw.detectedBankName === 'string' ? raw.detectedBankName : undefined,
  };
}
