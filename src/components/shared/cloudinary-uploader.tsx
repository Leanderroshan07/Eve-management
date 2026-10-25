"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, Image as ImageIcon, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary, LUXURY_PRESET_IMAGES } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface CloudinaryUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

export function CloudinaryUploader({
  value,
  onChange,
  label = "Upload High-Resolution Media",
  helperText = "Supports JPEG, PNG, WebP up to 10MB. Uploads via Cloudinary.",
  className,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showPresets, setShowPresets] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      setError("Please select an image file (JPEG, PNG, WebP) or PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 10MB.");
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      onChange(result.secure_url);
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <UploadCloud className="h-3.5 w-3.5 text-primary" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <Sparkles className="h-3 w-3" />
          {showPresets ? "Hide Presets" : "Pick Curated Asset"}
        </button>
      </div>

      {/* Preset Luxury Gallery Tray */}
      {showPresets && (
        <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <p className="text-[11px] font-medium text-foreground/80">
            Select high-res luxury event showcase photo:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {LUXURY_PRESET_IMAGES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={cn(
                  "relative group aspect-square rounded-lg overflow-hidden border border-border/80 transition-all hover:scale-105 hover:border-primary cursor-pointer",
                  value === preset.url && "ring-2 ring-primary border-primary"
                )}
                title={preset.name}
              >
                <Image
                  src={preset.url}
                  alt={preset.name}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                  <span className="text-[9px] text-white font-medium line-clamp-2">
                    {preset.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-card/60 p-2 flex items-center gap-3">
          <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted">
            <Image
              src={value}
              alt="Uploaded Asset"
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Asset attached & verified</span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
              {value}
            </p>
          </div>
          <div className="flex items-center gap-1.5 pr-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 cursor-pointer"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-border/80 hover:border-primary/60 bg-background/50 hover:bg-card/70",
            isUploading && "pointer-events-none opacity-80"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
              <p className="text-xs font-medium text-foreground">
                Optimizing & uploading to Cloudinary...
              </p>
              <p className="text-[10px] text-muted-foreground">Generating CDN transformations</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <ImageIcon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Drag & drop or <span className="text-primary underline">browse file</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
