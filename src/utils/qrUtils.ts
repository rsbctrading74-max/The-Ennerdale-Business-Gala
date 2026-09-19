import QRCode from 'qrcode';

/**
 * Generate a high quality QR Code as a data URL.
 */
export async function generateQrCodeDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 320,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#09090b',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}

/**
 * Formats a Capitec Pay / South African Bank QR payload
 * Capitec Scan to Pay standard reference format.
 */
export function buildCapitecQrPayload(accountNumber: string, accountName: string, reference: string, amountZAR: number): string {
  // Standard format accepted by SA Banking apps / Capitec Scan-to-pay
  return `CAPITEC-PAY|ACC:${accountNumber}|NAME:${encodeURIComponent(accountName)}|REF:${reference}|AMOUNT:${amountZAR.toFixed(2)}|BRANCH:470010`;
}

/**
 * Generate random reference code like RSBC-EBG-8491
 */
export function generateReferenceCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RSBC-EBG-${rand}`;
}

/**
 * Play audible feedback for the digital scanner without external audio files
 */
class SoundFeedback {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // First high note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Second higher note (ding!)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.08); // E6
    gain2.gain.setValueAtTime(0.2, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  }

  playWarning() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const scannerSounds = new SoundFeedback();
