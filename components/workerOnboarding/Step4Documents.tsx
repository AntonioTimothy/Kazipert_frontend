"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, Loader2, Camera, Eye, XCircle } from "lucide-react"
import { useState } from "react"
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

  const ImageUploadWithPreview = ({
    id,
    label,
    required,
    currentImage,
    documentType,
    aspectRatio = "square",
    showChangeOption = false
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
    const [localPreview, setLocalPreview] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        if (localPreview) {
          URL.revokeObjectURL(localPreview)
        }
        
        const previewUrl = URL.createObjectURL(file)
        setLocalPreview(previewUrl)
        
        setIsUploading(true)
        try {
          await onFileUpload(file, documentType)
        } catch (error) {
          console.error('Upload failed:', error)
        } finally {
          setIsUploading(false)
        }
      }
    }

    const handleImageError = (imageId: string) => {
      setImageErrors(prev => ({ ...prev, [imageId]: true }))
    }

    const handleImageLoad = (imageId: string) => {
      setImageErrors(prev => ({ ...prev, [imageId]: false }))
    }

    const displayImage = localPreview || currentImage
    const hasError = imageErrors[id]

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
              if (file) {
                if (localPreview) {
                  URL.revokeObjectURL(localPreview)
                }
                const previewUrl = URL.createObjectURL(file)
                setLocalPreview(previewUrl)
                setIsUploading(true)
                await onFileUpload(file, documentType)
                setIsUploading(false)
              }
            }}
            onClick={() => !isUploading && document.getElementById(id)?.click()}
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
                <p className="text-xs text-theme-text-muted">or drag and drop</p>
                <p className="text-xs text-theme-text-muted mt-1">JPEG, PNG, WebP (max 5MB)</p>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className={cn(
            "border-2 border-dashed rounded-lg p-4 flex items-center justify-center relative bg-white",
            aspectRatio === "square" ? "h-32" : "h-24",
            hasError ? "border-theme-error bg-theme-error/5" : "border-theme-border"
          )}>
            {displayImage && !hasError ? (
              <div className="relative group w-full h-full flex items-center justify-center">
                <img 
                  src={displayImage} 
                  alt="Preview" 
                  className={cn(
                    "object-contain rounded-lg",
                    aspectRatio === "square" ? "max-h-20 max-w-20" : "max-h-16 max-w-32"
                  )}
                  onError={() => handleImageError(id)}
                  onLoad={() => handleImageLoad(id)}
                />
                <button
                  onClick={() => window.open(displayImage, '_blank')}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center"
                >
                  <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100" />
                </button>
                {showChangeOption && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-6 text-xs bg-white border-theme-border"
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById(id)?.click()
                    }}
                  >
                    Change
                  </Button>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
            ) : hasError ? (
              <div className="text-center text-theme-error">
                <XCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Failed to load image</p>
                <p className="text-xs">Please re-upload</p>
              </div>
            ) : (
              <div className="text-center text-theme-text-muted">
                <p className="text-sm">No image uploaded</p>
                <p className="text-xs">Preview will appear here</p>
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

  const DocumentUploadField = ({
    id,
    label,
    required,
    optional = false,
    currentFile,
    documentType,
    onSkip
  }: {
    id: string
    label: string
    required: boolean
    optional?: boolean
    currentFile: string | null
    documentType: string
    onSkip?: () => void
  }) => {
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFileNames(prev => ({
          ...prev,
          [id]: file.name
        }))
        setIsUploading(true)
        await onFileUpload(file, documentType)
        setIsUploading(false)
      }
    }

    const fileName = selectedFileNames[id] || (currentFile ? 'File uploaded' : null)

    return (
      <div className="space-y-3 p-4 border rounded-lg bg-theme-background-light">
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-sm font-semibold text-theme-text">
            {label} {required && "*"} {optional && <span className="text-theme-text-muted font-normal">(Optional)</span>}
          </Label>
          {optional && !currentFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSkip}
              className="h-7 text-xs border-theme-border hover:bg-theme-primary/10"
            >
              I don't have this
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer h-24 flex items-center justify-center",
              isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-theme-primary hover:bg-theme-primary/5"
            )}
            onClick={() => !isUploading && document.getElementById(id)?.click()}
          >
            <Input
              id={id}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 animate-spin text-theme-primary mb-2" />
                <p className="text-sm font-medium text-theme-text">Uploading...</p>
              </div>
            ) : fileName ? (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-theme-success mx-auto mb-2" />
                <p className="text-sm font-medium truncate text-theme-text">{fileName}</p>
                <p className="text-xs text-theme-success">Click to change file</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 text-theme-text-muted mx-auto mb-2" />
                <p className="text-sm font-medium text-theme-text">Click to upload</p>
                <p className="text-xs text-theme-text-muted">or drag and drop</p>
              </div>
            )}
          </div>

          <div className="border-2 border-dashed border-theme-border rounded-lg p-4 h-24 flex items-center justify-center bg-white">
            {currentFile && currentFile !== 'skipped' ? (
              <div className="text-center">
                <FileText className="h-8 w-8 text-theme-success mx-auto mb-1" />
                <p className="text-xs text-theme-success">Document uploaded</p>
                <button 
                  onClick={() => window.open(currentFile, '_blank')}
                  className="text-xs text-theme-primary hover:underline mt-1"
                >
                  View
                </button>
              </div>
            ) : currentFile === 'skipped' ? (
              <div className="text-center text-theme-text-muted">
                <FileText className="h-8 w-8 text-theme-text-muted mx-auto mb-1" />
                <p className="text-xs">Skipped</p>
              </div>
            ) : (
              <div className="text-center text-theme-text-muted">
                <p className="text-xs">No document uploaded</p>
                {optional && <p className="text-xs">Optional document</p>}
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

      <div className="space-y-6">
        <ImageUploadWithPreview
          id="profilePicture"
          label="Profile Picture *"
          required={true}
          currentImage={data.documents.profilePicture}
          documentType="profilePicture"
          aspectRatio="square"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <ImageUploadWithPreview
            id="idDocumentFront"
            label="National ID Front *"
            required={true}
            currentImage={data.documents.idDocumentFront}
            documentType="idDocumentFront"
            aspectRatio="rectangle"
            showChangeOption={true}
          />

          <ImageUploadWithPreview
            id="idDocumentBack"
            label="National ID Back *"
            required={true}
            currentImage={data.documents.idDocumentBack}
            documentType="idDocumentBack"
            aspectRatio="rectangle"
            showChangeOption={true}
          />
        </div>

        <DocumentUploadField
          id="passportDocument"
          label="Passport Document"
          required={false}
          optional={true}
          currentFile={data.documents.passportDocument}
          documentType="passport"
          onSkip={() => {
            updateData('documents', { passportDocument: 'skipped' })
          }}
        />

        <DocumentUploadField
          id="kraDocument"
          label="KRA PIN Certificate"
          required={false}
          optional={true}
          currentFile={data.documents.kraDocument}
          documentType="kra"
          onSkip={() => {
            updateData('documents', { kraDocument: 'skipped' })
          }}
        />

        <DocumentUploadField
          id="goodConductDocument"
          label="Certificate of Good Conduct"
          required={false}
          optional={true}
          currentFile={data.documents.goodConductUrl}
          documentType="goodConduct"
          onSkip={() => {
            updateData('documents', { goodConductUrl: 'skipped' })
          }}
        />
      </div>
    </div>
  )
}