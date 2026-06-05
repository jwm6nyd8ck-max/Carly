"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onResult?: (barcode: string) => void;
  onClose?: () => void;
}

export default function Scanner({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const router = useRouter();
  const scannerRef = useRef<{ stop: () => void } | null>(null);

  const handleResult = useCallback(
    (barcode: string) => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
      if (onResult) {
        onResult(barcode);
      } else {
        router.push(`/api/scan?barcode=${encodeURIComponent(barcode)}`);
      }
    },
    [onResult, router]
  );

  useEffect(() => {
    let active = true;

    async function startScanner() {
      try {
        setScanning(true);
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();

        if (!videoRef.current || !active) return;

        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && active) {
              active = false;
              handleResult(result.getText());
            }
          }
        );

        scannerRef.current = controls;
      } catch (e) {
        if (active) {
          setError(
            e instanceof Error && e.name === "NotAllowedError"
              ? "Camera permission denied. Please allow camera access."
              : "Unable to access camera. Please try manual entry."
          );
        }
      } finally {
        if (active) setScanning(false);
      }
    }

    startScanner();

    return () => {
      active = false;
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
      }
    };
  }, [handleResult]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0A1E] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[rgba(15,10,30,0.9)]">
        <h2 className="font-display text-lg text-[#F7F5FF]">Scan Clothing Tag</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[rgba(155,127,232,0.15)] flex items-center justify-center text-[#9B7FE8] hover:bg-[rgba(155,127,232,0.25)] transition-colors"
            aria-label="Close scanner"
          >
            ✕
          </button>
        )}
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-4xl">📷</span>
            <p className="text-[#E84433] font-body text-sm">{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-40">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#9B7FE8] rounded-tl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#9B7FE8] rounded-tr" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#9B7FE8] rounded-bl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#9B7FE8] rounded-br" />
                {/* Scan line */}
                <div
                  className="absolute left-2 right-2 h-0.5 bg-[#9B7FE8] shadow-[0_0_6px_rgba(155,127,232,0.8)]"
                  style={{
                    animation: "scan-line 2s ease-in-out infinite",
                    top: "50%",
                  }}
                />
              </div>
            </div>
          </>
        )}
        {scanning && !error && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <p className="text-xs font-body text-[#9B7FE8] animate-pulse">
              Scanning for barcode…
            </p>
          </div>
        )}
      </div>

      {/* Manual entry fallback */}
      <div className="px-4 py-4 bg-[rgba(15,10,30,0.9)]">
        <p className="text-center text-xs text-[rgba(155,127,232,0.6)] mb-3">
          Can&apos;t scan? Enter manually
        </p>
        <ManualEntry onSubmit={handleResult} />
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0%, 100% { transform: translateY(-20px); opacity: 0.6; }
          50% { transform: translateY(20px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ManualEntry({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Brand name or barcode"
        className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(45,27,105,0.4)] border border-[rgba(155,127,232,0.2)] text-[#F7F5FF] placeholder-[#9B7FE8] font-body text-sm focus:outline-none focus:border-[#9B7FE8]"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-5 py-2.5 rounded-xl bg-indigo-mid text-white font-body text-sm font-medium disabled:opacity-40 hover:bg-[#7B5FDF] transition-colors"
      >
        Go
      </button>
    </form>
  );
}
