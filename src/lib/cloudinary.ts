import { env } from "@/lib/env";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

export const LUXURY_PRESET_IMAGES = [
  {
    name: "Crystal Chandelier Pavilion",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
    category: "Decor & Staging",
  },
  {
    name: "Concert Line Array & Truss Rig",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    category: "Audio & Lighting",
  },
  {
    name: "Imperial Brass Mandap Setup",
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80",
    category: "Decor & Staging",
  },
  {
    name: "Gold Chiavari & Silk Banquet",
    url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80",
    category: "Furniture & Tableware",
  },
  {
    name: "Moving Head Laser Stage Rig",
    url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80",
    category: "Audio & Lighting",
  },
  {
    name: "White Grand Piano Centerpiece",
    url: "https://images.unsplash.com/photo-1520523839898-5071282543e1?w=1200&auto=format&fit=crop&q=80",
    category: "Specialty & Instruments",
  },
];

/**
 * Uploads a media file to Cloudinary using an unsigned upload preset.
 * Falls back seamlessly to an in-browser object URL for local previews if Cloudinary keys are missing or credentials are mock.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Direct upload via secure authenticated server route (/api/upload)
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.secure_url) {
        return {
          secure_url: data.secure_url,
          public_id: data.public_id,
          format: data.format,
          bytes: data.bytes,
          width: data.width,
          height: data.height,
        };
      }
    }
  } catch (err) {
    console.warn("Server upload attempt error, trying unsigned client route:", err);
  }

  // Fallback direct unsigned client upload if upload_preset is set
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          secure_url: data.secure_url,
          public_id: data.public_id,
          format: data.format,
          bytes: data.bytes,
          width: data.width,
          height: data.height,
        };
      }
    } catch (err) {
      console.warn("Cloudinary upload network error, falling back to local media buffer:", err);
    }
  }

  // Graceful browser-native fallback: read as data URL for instant live preview and persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        secure_url: reader.result as string,
        public_id: `veluxe-local-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
        bytes: file.size,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
