import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "cqanlo11";
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary API credentials missing on server" },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    // Convert file to base64 data URI for reliable transmission to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadFormData = new FormData();
    uploadFormData.append("file", base64Data);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("signature", signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const res = await fetch(endpoint, {
      method: "POST",
      body: uploadFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudinary upload failed:", errText);
      return NextResponse.json({ error: "Cloudinary upload failed", details: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      secure_url: data.secure_url,
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
