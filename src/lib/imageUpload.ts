const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_COIN_BYTES = 5 * 1024 * 1024;
const MAX_BANNER_BYTES = 10 * 1024 * 1024;

export type ProfileImageKind = "coin" | "banner";

export function validateImageFile(
  file: File,
  kind: ProfileImageKind
): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use JPEG, PNG, WebP, or GIF";
  }

  const maxBytes = kind === "coin" ? MAX_COIN_BYTES : MAX_BANNER_BYTES;
  if (file.size > maxBytes) {
    return kind === "coin"
      ? "Coin image must be 5 MB or smaller"
      : "Banner must be 10 MB or smaller";
  }

  return null;
}

export async function validateImageDimensions(
  file: File,
  kind: ProfileImageKind
): Promise<string | null> {
  const minWidth = kind === "coin" ? 100 : 600;
  const expectedRatio = kind === "coin" ? 1 : 3;
  const ratioTolerance = kind === "coin" ? 0.15 : 0.2;

  const url = URL.createObjectURL(file);
  try {
    const { width, height } = await loadImageSize(url);
    if (width < minWidth) {
      return kind === "coin"
        ? "Coin image must be at least 100px wide"
        : "Banner must be at least 600px wide";
    }

    const ratio = width / height;
    if (Math.abs(ratio - expectedRatio) > ratioTolerance) {
      return kind === "coin"
        ? "Coin image should be roughly square (1:1)"
        : "Banner should be roughly 3:1 wide";
    }

    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImageSize(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

export async function uploadProfileImage(
  file: File,
  kind: ProfileImageKind
): Promise<string> {
  const fileError = validateImageFile(file, kind);
  if (fileError) throw new Error(fileError);

  const dimensionError = await validateImageDimensions(file, kind);
  if (dimensionError) throw new Error(dimensionError);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error ?? "Upload failed");
  }

  return data.data.url as string;
}
