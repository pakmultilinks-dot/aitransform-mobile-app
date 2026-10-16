/**
 * aiTransform API client.
 *
 * MOCK_MODE = true (default): every function returns realistic simulated data
 * after a short delay, so the whole app is demoable with zero keys and no
 * backend. Set MOCK_MODE = false and BASE_URL to the real aiTransform backend
 * to go live. Every live endpoint is marked with a TODO.
 */

export const BASE_URL = "https://api.aitransform.com";
export const MOCK_MODE = true;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface UsageStats {
  wordsGenerated: number;
  imagesGenerated: number;
  chatSessions: number;
  planWordLimit: number;
}

export interface ActivityItem {
  id: string;
  tool: string;
  title: string;
  time: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function live<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  return (await res.json()) as T;
}

// ---------------- Auth ----------------

export async function login(email: string, password: string): Promise<AuthTokens> {
  if (MOCK_MODE) {
    await delay(900);
    if (!email.includes("@")) {
      throw new Error("Invalid email or password.");
    }
    return { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" };
  }
  // TODO: wire to real aiTransform backend: POST /auth/login
  return live<AuthTokens>("/auth/login", { email, password });
}

export async function signup(
  name: string,
  email: string,
  _password: string
): Promise<{ userId: string }> {
  void _password;
  if (MOCK_MODE) {
    await delay(1100);
    return { userId: "mock-user-123" };
  }
  // TODO: wire to real aiTransform backend: POST /auth/signup
  return live<{ userId: string }>("/auth/signup", { name, email });
}

export async function verifyEmail(email: string, code: string): Promise<void> {
  if (MOCK_MODE) {
    await delay(800);
    if (code !== "123456" && code.length !== 6) {
      throw new Error("Invalid verification code.");
    }
    return;
  }
  // TODO: wire to real aiTransform backend: POST /auth/verify-email
  await live("/auth/verify-email", { email, code });
}

export async function resendCode(email: string): Promise<void> {
  if (MOCK_MODE) {
    await delay(600);
    return;
  }
  // TODO: wire to real aiTransform backend: POST /auth/resend-code
  await live("/auth/resend-code", { email });
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (MOCK_MODE) {
    await delay(800);
    return;
  }
  // TODO: wire to real aiTransform backend: POST /auth/forgot-password
  await live("/auth/forgot-password", { email });
}

export async function resetPassword(
  email: string,
  code: string,
  _newPassword: string
): Promise<void> {
  void _newPassword;
  if (MOCK_MODE) {
    await delay(900);
    if (code.length !== 6) {
      throw new Error("Invalid reset code.");
    }
    return;
  }
  // TODO: wire to real aiTransform backend: POST /auth/reset-password
  await live("/auth/reset-password", { email, code });
}

// ---------------- AI tools ----------------

const WRITER_SAMPLES = [
  "Transform your ideas into compelling content. Our AI studied your prompt and drafted copy tuned for clarity, tone, and conversion. Edit freely, regenerate anytime, and export when it shines.",
  "Here is a polished draft based on your brief. The opening hooks the reader, the body builds the argument with concrete detail, and the close ends on a clear call to action.",
];

export async function generateText(prompt: string, tone: string): Promise<string> {
  if (MOCK_MODE) {
    await delay(1600);
    const sample = WRITER_SAMPLES[prompt.length % WRITER_SAMPLES.length];
    return `[${tone} tone] ${sample}\n\nPrompt: "${prompt.slice(0, 120)}"`;
  }
  // TODO: wire to real aiTransform backend: POST /ai/writer
  const r = await live<{ text: string }>("/ai/writer", { prompt, tone });
  return r.text;
}

export async function generateImage(
  prompt: string,
  style: string,
  _aspect: string
): Promise<{ imageUrl: string }> {
  void _aspect;
  if (MOCK_MODE) {
    await delay(2200);
    const seed = encodeURIComponent(`${style}-${prompt}`.slice(0, 40));
    return { imageUrl: `https://picsum.photos/seed/${seed}/1024/1024` };
  }
  // TODO: wire to real aiTransform backend: POST /ai/image
  return live<{ imageUrl: string }>("/ai/image", { prompt, style });
}

export async function chatSend(
  history: ChatMessage[],
  text: string
): Promise<string> {
  if (MOCK_MODE) {
    await delay(1200);
    const n = history.filter((m) => m.role === "user").length + 1;
    return (
      `Got it. This is a simulated aiTransform reply (#${n}) so you can demo the full chat flow ` +
      `with no API key. Ask me to write, brainstorm, or explain anything, and connect the real ` +
      `backend to get live answers. You said: "${text.slice(0, 80)}"`
    );
  }
  // TODO: wire to real aiTransform backend: POST /ai/chat
  const r = await live<{ reply: string }>("/ai/chat", { history, text });
  return r.reply;
}

export async function generateCode(
  prompt: string,
  language: string
): Promise<string> {
  if (MOCK_MODE) {
    await delay(1500);
    return (
      `// ${language} (simulated output)\n` +
      `// Prompt: ${prompt.slice(0, 80)}\n\n` +
      `function transform(input) {\n` +
      `  // TODO: connect the real aiTransform code endpoint\n` +
      `  const result = input.trim();\n` +
      `  return result;\n` +
      `}\n`
    );
  }
  // TODO: wire to real aiTransform backend: POST /ai/code
  const r = await live<{ code: string }>("/ai/code", { prompt, language });
  return r.code;
}

export async function transcribeAudio(): Promise<string> {
  // Engine stub: microphone capture is not wired in this build.
  await delay(1000);
  // TODO: wire expo-av recording plus real aiTransform backend: POST /ai/speech-to-text
  return "Simulated transcription: connect the speech engine to transcribe real audio.";
}

export async function synthesizeVoice(
  text: string,
  voice: string
): Promise<{ audioUrl: string }> {
  if (MOCK_MODE) {
    await delay(1800);
    void text;
    void voice;
    return { audioUrl: "" };
  }
  // TODO: wire to real aiTransform backend: POST /ai/voiceover
  return live<{ audioUrl: string }>("/ai/voiceover", { text, voice });
}

// ---------------- Dashboard ----------------

export async function getUsageStats(): Promise<UsageStats> {
  if (MOCK_MODE) {
    await delay(700);
    return {
      wordsGenerated: 48210,
      imagesGenerated: 132,
      chatSessions: 47,
      planWordLimit: 100000,
    };
  }
  // TODO: wire to real aiTransform backend: GET /dashboard/usage
  const res = await fetch(`${BASE_URL}/dashboard/usage`);
  return (await res.json()) as UsageStats;
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  if (MOCK_MODE) {
    await delay(700);
    return [
      { id: "1", tool: "AI Writer", title: "Product launch email", time: "2h ago" },
      { id: "2", tool: "AI Image", title: "Hero banner, digital art", time: "5h ago" },
      { id: "3", tool: "AI Chat", title: "Brainstorm session", time: "Yesterday" },
      { id: "4", tool: "AI Code", title: "Python data parser", time: "Yesterday" },
    ];
  }
  // TODO: wire to real aiTransform backend: GET /dashboard/activity
  const res = await fetch(`${BASE_URL}/dashboard/activity`);
  return (await res.json()) as ActivityItem[];
}
