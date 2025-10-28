"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, Loader2, Camera, Eye, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Step4DocumentsProps {
  data: any
  updateData: (section: string, updates: any) => void
  user: any
  onFileUpload: (file: File, documentType: string) => Promise<boolean>
  uploadProgress: { [key: string]: number }
}

export default function Step4Documents({ data, updateData, user, onFileUpload, uploadProgress }: Step4DocumentsProps) {
  const [selectedFileNames, setSelectedFileNames] = useState<{ [key: string]: string }>({})
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [localImages, setLocalImages] = useState<{ [key: string]: string | null }>({})

  // 🔹 Automatically update previews when parent data changes
  useEffect(() => {
    if (data?.documents) {
      const docs = data.documents
      setLocalImages({
        profilePicture: docs.profilePicture || null,
        idDocumentFront: docs.idDocumentFront || null,
        idDocumentBack: docs.idDocumentBack || null,
      })
    }
  }, [data])

  const ImageUploadWithPreview = ({
    id,
    label,
    required,
    currentImage,
    documentType,
    aspectRatio = "square",
    showChangeOption = false,
  }: {
    id: string
    label: string
    required: boolean
    currentImage: string | null
    documentType: string
    aspectRatio?: "square" | "rectangle"
    showChangeOption?: boolean
  }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [localPreview, setLocalPreview] = useState<string | null>(currentImage)

    useEffect(() => {
      // update preview if parent data changes
      if (currentImage && !localPreview) {
        setLocalPreview(currentImage)
      }
    }, [currentImage])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const previewUrl = URL.createObjectURL(file)
        setLocalPreview(previewUrl)
        setImageErrors(prev => ({ ...prev, [id]: false }))
        setIsUploading(true)
        try {
          const success = await onFileUpload(file, documentType)
          if (success) {
            updateData("documents", { [documentType]: previewUrl })
            console.log(`✅ Uploaded ${documentType}`)
          }
        } catch (err) {
          console.error("❌ Upload failed:", err)
          setImageErrors(prev => ({ ...prev, [id]: true }))
        } finally {
          setIsUploading(false)
        }
      }
    }

    const displayImage = localPreview || currentImage
    const hasError = imageErrors[id]

    const handleUploadClick = () => {
      if (!isUploading) document.getElementById(id)?.click()
    }

    return (
      <div className="space-y-3">
        <Label htmlFor={id} className="text-sm font-semibold text-theme-text">
          {label} {required && "*"}
        </Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer flex items-center justify-center bg-white",
              isDragging
                ? "border-theme-primary bg-theme-primary/10"
                : "border-theme-border hover:border-theme-primary hover:bg-theme-primary/5",
              isUploading && "opacity-50 cursor-not-allowed",
              aspectRatio === "square" ? "h-32" : "h-24"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
            onDrop={async (e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file && !isUploading) {
                const previewUrl = URL.createObjectURL(file)
                setLocalPreview(previewUrl)
                setIsUploading(true)
                await onFileUpload(file, documentType)
                setIsUploading(false)
              }
            }}
            onClick={handleUploadClick}
          >
            <Input
              id={id}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 animate-spin text-theme-primary mb-2" />
                <p className="text-sm font-medium text-theme-text">Uploading...</p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-8 w-8 text-theme-text-muted mx-auto mb-2" />
                <p className="text-sm font-medium text-theme-text">Click to upload</p>
                <p className="text-xs text-theme-text-muted">JPEG, PNG, WebP (max 5MB)</p>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 flex items-center justify-center relative bg-white",
              aspectRatio === "square" ? "h-32" : "h-24",
              hasError ? "border-theme-error bg-theme-error/5" : "border-theme-border"
            )}
          >
            {displayImage && !hasError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={displayImage}
                  alt="Preview"
                  className={cn(
                    "object-contain rounded-lg",
                    aspectRatio === "square" ? "max-h-20 max-w-20" : "max-h-16 max-w-32"
                  )}
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => window.open(displayImage, "_blank")}
                >
                  <Eye className="h-5 w-5 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ) : hasError ? (
              <div className="text-center text-theme-error">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Failed to load image</p>
              </div>
            ) : (
              <div className="text-center text-theme-text-muted">
                <p className="text-sm">No image uploaded</p>
              </div>
            )}
          </div>
        </div>

        {uploadProgress[documentType] > 0 && uploadProgress[documentType] < 100 && (
          <Progress value={uploadProgress[documentType]} className="h-1" />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-1">Document Upload</h3>
            <p className="text-theme-text-muted text-sm">
              Upload clear photos of your documents. National ID is required. Other documents can be skipped if not available.
            </p>
          </div>
        </div>
      </div>

      {/* Profile + ID Uploads */}
      <ImageUploadWithPreview
        id="profilePicture"
        label="Profile Picture *"
        required={true}
        currentImage={localImages.profilePicture}
        documentType="profilePicture"
        aspectRatio="square"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploadWithPreview
          id="idDocumentFront"
          label="National ID Front *"
          required={true}
          currentImage={localImages.idDocumentFront}
          documentType="idDocumentFront"
          aspectRatio="rectangle"
          showChangeOption={true}
        />
        <ImageUploadWithPreview
          id="idDocumentBack"
          label="National ID Back *"
          required={true}
          currentImage={localImages.idDocumentBack}
          documentType="idDocumentBack"
          aspectRatio="rectangle"
          showChangeOption={true}
        />
      </div>
    </div>
  )
}
