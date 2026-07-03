"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import {
  uploadProfileImage,
  type ProfileImageKind,
} from "@/lib/imageUpload";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  kind: ProfileImageKind;
  label: string;
  hint: string;
  value: string;
  fallbackPreview?: string | null;
  onChange: (url: string) => void;
  error?: string;
  previewClassName?: string;
}

export function ImageUploadField({
  kind,
  label,
  hint,
  value,
  fallbackPreview,
  onChange,
  error,
  previewClassName,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const previewSrc = value || fallbackPreview || null;
  const displayError = error ?? localError;

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setLocalError(null);
    setUploading(true);

    try {
      const url = await uploadProfileImage(file, kind);
      onChange(url);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clearUploaded = () => {
    onChange("");
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isSquarePreview = kind === "coin";

  return (
    <section className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="text-xs text-zinc-600">{hint}</span>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-lg border border-white/[0.08] bg-zinc-950",
          isSquarePreview ? "mx-auto mb-3 h-24 w-24" : "mb-3 aspect-[3/1]",
          previewClassName
        )}
      >
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt={`${label} preview`}
            width={isSquarePreview ? 96 : 600}
            height={isSquarePreview ? 96 : 200}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-600">
            No image yet
          </div>
        )}
      </div>

      {fallbackPreview && !value && (
        <p className="mb-3 text-xs text-zinc-600">
          Showing DexScreener image as reference — upload your own for the
          profile.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {value ? "Replace image" : "Upload image"}
        </Button>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploading}
            onClick={clearUploaded}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {displayError && (
        <p className="mt-2 text-xs text-red-400">{displayError}</p>
      )}
    </section>
  );
}
