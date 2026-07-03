import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { ApiResponse } from "@/types";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES: Record<string, number> = {
  coin: 5 * 1024 * 1024,
  banner: 10 * 1024 * 1024,
};

function extensionForType(type: string): string {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = formData.get("kind");

    if (!(file instanceof File)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (kind !== "coin" && kind !== "banner") {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid upload type" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Use JPEG, PNG, WebP, or GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES[kind]) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error:
            kind === "coin"
              ? "Coin image must be 5 MB or smaller"
              : "Banner must be 10 MB or smaller",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const ext = extensionForType(file.type);
    const path = `${crypto.randomUUID()}/${kind}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { data, error } = await supabase.storage
      .from("token-profiles")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error:
            error.message.includes("Bucket not found")
              ? "Image storage is not configured yet. Run the token-profiles storage migration in Supabase."
              : "Failed to upload image",
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("token-profiles").getPublicUrl(data.path);

    return NextResponse.json<ApiResponse<{ url: string }>>({
      success: true,
      data: { url: publicUrl },
    });
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
