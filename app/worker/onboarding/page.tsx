"use client"

import React, { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  MessageSquare,
  Video,
  Award,
  Shield,
  Star,
  CheckCircle,
  Upload,
  Camera,
  Heart,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  IdCard,
  Globe,
  GraduationCap,
  Languages,
  BookOpen,
  Eye,
  XCircle,
  Receipt,
  Smartphone,
  X,
  Search,
  Plus,
  Minus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from '@/contexts/ThemeContext'

const navigation = [
  { name: "Dashboard", href: "/worker/dashboard", icon: Home },
  { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
  { name: "My Applications", href: "/worker/contracts", icon: FileText },
  { name: "Wallet", href: "/worker/payments", icon: CreditCard },
  { name: "Services", href: "/worker/services", icon: Shield },
  { name: "Training", href: "/worker/training", icon: Video },
  { name: "Reviews", href: "/worker/reviews", icon: Star },
  { name: "Support", href: "/worker/support", icon: MessageSquare },
]

interface OnboardingData {
  personalInfo: {
    dateOfBirth: string
    county: string
    physicalAddress: string
  }
  kycDetails: {
    idNumber: string
    passportNumber: string
    passportIssueDate: string
    passportExpiryDate: string
    kraPin: string
    maritalStatus: string
    hasChildren: string
    numberOfChildren: number
    workedAbroad: string
    countriesWorked: string[]
    workExperience: string
    skills: string[]
    languages: {
      english: string
      swahili: string
      arabic: string
    }
  }
  documents: {
    profilePicture: string | null
    idDocumentFront: string | null
    idDocumentBack: string | null
    passportDocument: string | null
    kraDocument: string | null
    goodConductUrl: string | null
    educationCertUrl: string | null
    workCertUrl: string | null
    medicalDocument: string | null
  }
  verification: {
    faceVerified: boolean
    medicalVerified: boolean
    paymentVerified: boolean
  }
  payment: {
    mpesaNumber: string
    payLater: boolean
  }
}

// Kenya counties data
const kenyaCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", 
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", 
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", 
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", 
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", 
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", 
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
].sort()

// Countries list for international work experience
const countriesList = [
  "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Oman", "Bahrain",
  "United States", "United Kingdom", "Canada", "Australia", "South Africa",
  "Other"
].sort()

export default function WorkerOnboardingPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFileNames, setSelectedFileNames] = useState<{[key: string]: string}>({})
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [showCountyModal, setShowCountyModal] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [showCountriesModal, setShowCountriesModal] = useState(false)

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      dateOfBirth: "",
      county: "",
      physicalAddress: ""
    },
    kycDetails: {
      idNumber: "",
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      kraPin: "",
      maritalStatus: "",
      hasChildren: "",
      numberOfChildren: 0,
      workedAbroad: "",
      countriesWorked: [],
      workExperience: "",
      skills: [],
      languages: {
        english: "",
        swahili: "",
        arabic: ""
      }
    },
    documents: {
      profilePicture: null,
      idDocumentFront: null,
      idDocumentBack: null,
      passportDocument: null,
      kraDocument: null,
      goodConductUrl: null,
      educationCertUrl: null,
      workCertUrl: null,
      medicalDocument: null
    },
    verification: {
      faceVerified: false,
      medicalVerified: false,
      paymentVerified: false
    },
    payment: {
      mpesaNumber: "",
      payLater: false
    }
  })

  const totalSteps = 8

  const steps = [
    { number: 1, title: "Instructions", icon: BookOpen, description: "Read and accept terms" },
    { number: 2, title: "Personal Info", icon: User, description: "Complete your profile" },
    { number: 3, title: "KYC Details", icon: IdCard, description: "Identity information" },
    { number: 4, title: "Documents", icon: FileText, description: "Upload required documents" },
    { number: 5, title: "Face Verification", icon: Camera, description: "Photo matching" },
    { number: 6, title: "Photo Studio", icon: Camera, description: "Professional photos" },
    { number: 7, title: "Payment", icon: CreditCard, description: "Registration fee" },
    { number: 8, title: "Summary", icon: CheckCircle, description: "Review and submit" },
  ]

  // Auto-scroll to top when errors occur
  useEffect(() => {
    if (validationErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [validationErrors])

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    loadUserProgress(parsedUser.id)
  }, [router])

  const loadUserProgress = async (userId: string) => {
    try {
      const response = await fetch(`/api/onboarding/progress?userId=${userId}`)
      const data = await response.json()
      
      if (data.progress) {
        setCurrentStep(data.progress.currentStep)
        if (data.progress.kycDetails) {
          setOnboardingData(prev => ({
            ...prev,
            ...data.progress.kycDetails
          }))
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load progress:', error)
      setLoading(false)
    }
  }

  const saveProgress = async (step: number, data?: any) => {
    if (!user) return
    
    try {
      setSaving(true)
      const response = await fetch('/api/onboarding/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          step,
          ...data
        })
      })
      
      if (!response.ok) throw new Error('Failed to save progress')
    } catch (error) {
      console.error('Failed to save progress:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateOnboardingData = (section: string, updates: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...updates }
    }))
  }

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!file || !user) return false

    try {
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }))
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)
      formData.append('documentType', documentType)

      const response = await fetch('/api/onboarding/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setUploadProgress(prev => ({ ...prev, [documentType]: 100 }))
        
        const documentPropertyMap: { [key: string]: string } = {
          'profilePicture': 'profilePicture',
          'idDocumentFront': 'idDocumentFront', 
          'idDocumentBack': 'idDocumentBack',
          'passport': 'passportDocument',
          'kra': 'kraDocument',
          'goodConduct': 'goodConductUrl',
          'medical': 'medicalDocument'
        }

        const documentProperty = documentPropertyMap[documentType]

        if (documentProperty) {
          setOnboardingData(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [documentProperty]: result.fileUrl
            }
          }))
        }
        
        return true
      }
      return false
    } catch (error) {
      console.error('Upload failed:', error)
      return false
    }
  }

  const validateStep = (step: number): boolean => {
    const errors: string[] = []
    
    switch (step) {
      case 1: // Instructions
        // Check if all checkboxes are checked
        const checkboxes = document.querySelectorAll('input[type="checkbox"]')
        const allChecked = Array.from(checkboxes).every((checkbox: any) => checkbox.checked)
        if (!allChecked) errors.push("Please agree to all terms and conditions")
        break
        
      case 2: // Personal Info
        if (!onboardingData.personalInfo.dateOfBirth) errors.push("Date of birth is required")
        if (!onboardingData.personalInfo.county) errors.push("County is required")
        if (!onboardingData.personalInfo.physicalAddress) errors.push("Physical address is required")
        break
        
      case 3: // KYC Details
        if (!onboardingData.kycDetails.idNumber) errors.push("National ID number is required")
        if (!onboardingData.kycDetails.maritalStatus) errors.push("Marital status is required")
        if (!onboardingData.kycDetails.hasChildren) errors.push("Please indicate if you have children")
        if (onboardingData.kycDetails.hasChildren === "yes" && onboardingData.kycDetails.numberOfChildren === 0) 
          errors.push("Please specify number of children")
        if (!onboardingData.kycDetails.workedAbroad) errors.push("Please indicate if you've worked outside Kenya")
        if (!onboardingData.kycDetails.workExperience) errors.push("Work experience is required")
        if (onboardingData.kycDetails.skills.length === 0) errors.push("At least one skill is required")
        if (!onboardingData.kycDetails.languages.english) errors.push("English level is required")
        if (!onboardingData.kycDetails.languages.swahili) errors.push("Swahili level is required")
        break
        
      case 4: // Documents
        if (!onboardingData.documents.profilePicture) errors.push("Profile picture is required")
        if (!onboardingData.documents.idDocumentFront) errors.push("National ID front is required")
        if (!onboardingData.documents.idDocumentBack) errors.push("National ID back is required")
        break
        
      case 7: // Payment
        if (!onboardingData.payment.payLater && !onboardingData.payment.mpesaNumber) 
          errors.push("MPesa number is required or select 'I will pay later'")
        break
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        const nextStepNum = currentStep + 1
        setCurrentStep(nextStepNum)
        await saveProgress(nextStepNum, onboardingData)
        setValidationErrors([])
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setValidationErrors([])
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
      setValidationErrors([])
    }
  }

  const simulateFaceVerification = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/onboarding/face-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      
      const result = await response.json()
      setOnboardingData(prev => ({
        ...prev,
        verification: {
          ...prev.verification,
          faceVerified: result.faceVerified
        }
      }))
    } catch (error) {
      console.error('Face verification failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const processPayment = async () => {
    if (!user || !onboardingData.payment.mpesaNumber) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/onboarding/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          mpesaNumber: onboardingData.payment.mpesaNumber
        })
      })
      
      const result = await response.json()
      if (!result.success) {
        setValidationErrors([result.error])
      } else {
        setOnboardingData(prev => ({
          ...prev,
          verification: {
            ...prev.verification,
            paymentVerified: true
          }
        }))
        setValidationErrors([])
      }
    } catch (error) {
      setValidationErrors(['Payment service temporarily unavailable'])
    } finally {
      setSaving(false)
    }
  }

  const progress = (currentStep / totalSteps) * 100

  // County Selection Modal
  const CountyModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-theme-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden animate-theme-transition">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <div>
            <h2 className="text-xl font-bold text-theme-text">Select County of Residence</h2>
            <p className="text-theme-text-muted text-sm mt-1">Choose your county from the list below</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCountyModal(false)}
            className="hover:bg-theme-primary/10 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
            {kenyaCounties.map((county) => (
              <button
                key={county}
                onClick={() => {
                  updateOnboardingData('personalInfo', { county })
                  setShowCountyModal(false)
                }}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all duration-200 hover:scale-105",
                  onboardingData.personalInfo.county === county
                    ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-semibold"
                    : "border-theme-border hover:border-theme-primary hover:bg-theme-primary/5"
                )}
              >
                {county}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Countries Selection Modal
  const CountriesModal = () => {
    const filteredCountries = countriesList.filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    )

    const toggleCountry = (country: string) => {
      const currentCountries = [...onboardingData.kycDetails.countriesWorked]
      if (currentCountries.includes(country)) {
        updateOnboardingData('kycDetails', {
          countriesWorked: currentCountries.filter(c => c !== country)
        })
      } else {
        updateOnboardingData('kycDetails', {
          countriesWorked: [...currentCountries, country]
        })
      }
    }

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-theme-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-theme-transition">
          <div className="flex items-center justify-between p-6 border-b border-theme-border">
            <div>
              <h2 className="text-xl font-bold text-theme-text">Select Countries Worked In</h2>
              <p className="text-theme-text-muted text-sm mt-1">Choose all countries where you have worked</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCountriesModal(false)}
              className="hover:bg-theme-primary/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 border-b border-theme-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
              <Input
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="p-4 max-h-[40vh] overflow-y-auto">
            <div className="space-y-2">
              {filteredCountries.map((country) => (
                <div
                  key={country}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    onboardingData.kycDetails.countriesWorked.includes(country)
                      ? "border-theme-primary bg-theme-primary/10"
                      : "border-theme-border hover:border-theme-primary"
                  )}
                  onClick={() => toggleCountry(country)}
                >
                  <div className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center",
                    onboardingData.kycDetails.countriesWorked.includes(country)
                      ? "bg-theme-primary border-theme-primary"
                      : "border-theme-border"
                  )}>
                    {onboardingData.kycDetails.countriesWorked.includes(country) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{country}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-theme-border">
            <Button 
              onClick={() => setShowCountriesModal(false)}
              className="w-full"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const Stepper = ({ step, completedSteps }: { step: number; completedSteps: number[] }) => {
    return (
      <div className="relative mb-6">
        <div className="flex justify-between items-center">
          {steps.map((s, i) => {
            const stepNumber = i + 1
            const isCompleted = completedSteps.includes(stepNumber)
            const isCurrent = step === stepNumber
            const isIncomplete = stepNumber > step && !isCompleted
            
            return (
              <Fragment key={i}>
                <div className="flex flex-col items-center z-10">
                  <button
                    onClick={() => goToStep(stepNumber)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-xs transition-all duration-300 relative",
                      isCompleted
                        ? "bg-theme-success border-theme-success text-white shadow-md"
                        : isCurrent
                        ? `border-theme-primary bg-theme-background text-theme-text`
                        : isIncomplete
                        ? "border-theme-error/30 bg-theme-error/10 text-theme-error"
                        : "border-theme-border bg-theme-background text-theme-text-muted"
                    )}
                    style={{
                      borderColor: isCurrent ? currentTheme.colors.primary : undefined,
                      backgroundColor: isCurrent ? currentTheme.colors.background : undefined
                    }}
                  >
                    {isCompleted ? <CheckCircle size={14} /> : stepNumber}
                  </button>
                  <span className={cn(
                    "text-xs font-medium transition-colors mt-1 text-center",
                    isCompleted ? "text-theme-success" :
                    isCurrent ? "text-theme-text" :
                    isIncomplete ? "text-theme-error" :
                    "text-theme-text-muted"
                  )}>
                    {s.title}
                  </span>
                </div>
                
                {i < totalSteps - 1 && (
                  <div className={cn(
                    "flex-1 h-1 mx-1 transition-all duration-500",
                    isCompleted ? "bg-theme-success" :
                    stepNumber < step ? "bg-theme-primary" :
                    "bg-theme-border"
                  )} />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  const ImageUploadWithPreview = ({ 
    id, 
    label, 
    required, 
    currentImage,
    onFileSelect,
    aspectRatio = "square",
    showChangeOption = false
  }: {
    id: string
    label: string
    required: boolean
    currentImage: string | null
    onFileSelect: (file: File) => Promise<void>
    aspectRatio?: "square" | "rectangle"
    showChangeOption?: boolean
  }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setIsUploading(true)
        await onFileSelect(file)
        setIsUploading(false)
      }
    }

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) {
        setIsUploading(true)
        await onFileSelect(file)
        setIsUploading(false)
      }
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
              "border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer flex items-center justify-center",
              isDragging 
                ? "border-theme-primary bg-theme-primary/10" 
                : "border-theme-border hover:border-theme-primary hover:bg-theme-primary/5",
              isUploading && "opacity-50 cursor-not-allowed",
              aspectRatio === "square" ? "h-32" : "h-24"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
            onDrop={handleDrop}
            onClick={() => !isUploading && document.getElementById(id)?.click()}
          >
            <Input
              id={id}
              type="file"
              accept="image/*"
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
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className={cn(
            "border-2 border-dashed border-theme-border rounded-lg p-4 flex items-center justify-center relative",
            aspectRatio === "square" ? "h-32" : "h-24"
          )}>
            {currentImage ? (
              <div className="relative group">
                <img 
                  src={currentImage} 
                  alt="Preview" 
                  className={cn(
                    "object-cover rounded-lg",
                    aspectRatio === "square" ? "h-20 w-20" : "h-16 w-24"
                  )}
                />
                <button
                  onClick={() => window.open(currentImage, '_blank')}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center"
                >
                  <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100" />
                </button>
                {showChangeOption && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-6 text-xs bg-theme-background"
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById(id)?.click()
                    }}
                  >
                    Change
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center text-theme-text-muted">
                <p className="text-sm">No image uploaded</p>
                <p className="text-xs">Preview will appear here</p>
              </div>
            )}
          </div>
        </div>
        
        {uploadProgress[id] > 0 && uploadProgress[id] < 100 && (
          <Progress value={uploadProgress[id]} className="h-1" />
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
    onFileSelect,
    onSkip
  }: {
    id: string
    label: string
    required: boolean
    optional?: boolean
    currentFile: string | null
    onFileSelect: (file: File) => Promise<void>
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
        await onFileSelect(file)
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
              accept="image/*,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.heic,.heif"
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

          <div className="border-2 border-dashed border-theme-border rounded-lg p-4 h-24 flex items-center justify-center">
            {currentFile ? (
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
            ) : (
              <div className="text-center text-theme-text-muted">
                <p className="text-xs">No document uploaded</p>
                {optional && <p className="text-xs">Optional document</p>}
              </div>
            )}
          </div>
        </div>

        {uploadProgress[id] > 0 && uploadProgress[id] < 100 && (
          <Progress value={uploadProgress[id]} className="h-1" />
        )}
      </div>
    )
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const completedSteps = Array.from({ length: currentStep - 1 }, (_, i) => i + 1)

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-theme-text">
              Complete Your Profile
              <BookOpen className="h-6 w-6 text-theme-primary" />
            </h1>
            <p className="text-theme-text-muted">Finish onboarding to start applying for jobs in Oman</p>
          </div>
          <Badge variant="outline" className={cn(
            "px-3 py-1",
            saving ? "bg-theme-warning/10 text-theme-warning border-theme-warning/30" : "bg-theme-success/10 text-theme-success border-theme-success/30"
          )}>
            {saving ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {saving ? "Saving..." : "Auto-saved"}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-theme-text">Step {currentStep} of {totalSteps}</span>
            <span className="font-medium text-theme-primary">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Stepper step={currentStep} completedSteps={completedSteps} />

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="border-theme-error/20 bg-theme-error/10">
            <AlertCircle className="h-4 w-4 text-theme-error" />
            <AlertDescription className="text-theme-error">
              Please complete the following required fields:
              <ul className="mt-1 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="border border-theme-border shadow-sm bg-theme-background">
          <CardHeader className="border-b bg-gradient-theme-subtle pb-4">
            <div className="flex items-center gap-3">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon
                return (
                  <div 
                    className="h-10 w-10 rounded-lg border-2 flex items-center justify-center"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      borderColor: `${currentTheme.colors.primary}40`
                    }}
                  >
                    <StepIcon className="h-5 w-5 text-theme-primary" />
                  </div>
                )
              })()}
              <div>
                <CardTitle className="text-lg text-theme-text">{steps[currentStep - 1].title}</CardTitle>
                <CardDescription className="text-theme-text-muted">{steps[currentStep - 1].description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Step 1: Instructions */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-text mb-2">Important Instructions</h3>
                          <p className="text-theme-text-muted text-sm">
                            Please read the following instructions carefully before proceeding with your onboarding.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-theme-background border-theme-border">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                              <CheckCircle className="h-4 w-4 text-theme-success" />
                              Required Documents
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm text-theme-text-muted">
                              <li>• National ID Card (Front & Back)</li>
                              <li>• Profile Photo</li>
                              <li>• Medical Certificate</li>
                              <li>• Passport (Optional)</li>
                              <li>• KRA PIN Certificate (Optional)</li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-theme-background border-theme-border">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                              <CheckCircle className="h-4 w-4 text-theme-success" />
                              Process Timeline
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm text-theme-text-muted">
                              <li>• Complete all steps: 15-20 minutes</li>
                              <li>• Document verification: 24-48 hours</li>
                              <li>• Medical check: 1-2 days</li>
                              <li>• Job matching: Within 1 week</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <Card 
                        className="border-2"
                        style={{
                          borderColor: `${currentTheme.colors.primary}30`,
                          backgroundColor: `${currentTheme.colors.primary}05`
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-sm text-theme-text">Attestation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox id="accuracy" />
                            <label htmlFor="accuracy" className="text-sm cursor-pointer text-theme-text">
                              I attest that all information provided is accurate and truthful to the best of my knowledge.
                            </label>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Checkbox id="terms" />
                            <label htmlFor="terms" className="text-sm cursor-pointer text-theme-text">
                              I agree to the <a href="/terms" className="text-theme-primary hover:underline">Terms of Service</a> and{" "}
                              <a href="/privacy" className="text-theme-primary hover:underline">Privacy Policy</a>.
                            </label>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Checkbox id="consent" />
                            <label htmlFor="consent" className="text-sm cursor-pointer text-theme-text">
                              I consent to the verification of my documents and background checks as required for employment in Oman.
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-text mb-1">Personal Information</h3>
                          <p className="text-theme-text-muted text-sm">
                            Your basic information has been prefilled from your account. Please complete the remaining fields.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Prefilled User Info */}
                    <Card className="bg-theme-background border-theme-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-theme-text">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-theme-text-muted">Full Name:</span>
                            <p className="font-medium text-theme-text">{user.fullName}</p>
                          </div>
                          <div>
                            <span className="text-theme-text-muted">Email:</span>
                            <p className="font-medium text-theme-text">{user.email}</p>
                          </div>
                          <div>
                            <span className="text-theme-text-muted">Phone:</span>
                            <p className="font-medium text-theme-text">{user.phone}</p>
                          </div>
                          <div>
                            <span className="text-theme-text-muted">Gender:</span>
                            <p className="font-medium text-theme-text capitalize">{user.gender}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Editable Fields */}
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-theme-text">
                            Date of Birth *
                          </Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            className="h-9 border-theme-border focus:border-theme-primary"
                            value={onboardingData.personalInfo.dateOfBirth}
                            onChange={(e) => updateOnboardingData('personalInfo', { dateOfBirth: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="county" className="text-sm font-semibold text-theme-text">
                            County of Residence *
                          </Label>
                          <div className="relative">
                            <Input
                              id="county"
                              placeholder="Select your county"
                              className="h-9 border-theme-border focus:border-theme-primary cursor-pointer"
                              value={onboardingData.personalInfo.county}
                              readOnly
                              onClick={() => setShowCountyModal(true)}
                            />
                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="physicalAddress" className="text-sm font-semibold text-theme-text">
                          Home Address *
                        </Label>
                        <Textarea
                          id="physicalAddress"
                          placeholder="Enter your full physical address"
                          rows={3}
                          className="border-theme-border focus:border-theme-primary"
                          value={onboardingData.personalInfo.physicalAddress}
                          onChange={(e) => updateOnboardingData('personalInfo', { physicalAddress: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: KYC Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <IdCard className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-text mb-1">KYC Verification</h3>
                          <p className="text-theme-text-muted text-sm">
                            Provide your identity information. Passport and KRA PIN are optional but recommended for better job matching.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="idNumber" className="text-sm font-semibold text-theme-text">
                            National ID Number *
                          </Label>
                          <Input
                            id="idNumber"
                            placeholder="Enter your ID number"
                            className="h-9 border-theme-border focus:border-theme-primary"
                            value={onboardingData.kycDetails.idNumber}
                            onChange={(e) => updateOnboardingData('kycDetails', { idNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passportNumber" className="text-sm font-semibold text-theme-text">
                            Passport Number <span className="text-theme-text-muted font-normal">(Optional)</span>
                          </Label>
                          <Input
                            id="passportNumber"
                            placeholder="Enter passport number"
                            className="h-9 border-theme-border focus:border-theme-primary"
                            value={onboardingData.kycDetails.passportNumber}
                            onChange={(e) => updateOnboardingData('kycDetails', { passportNumber: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="kraPin" className="text-sm font-semibold text-theme-text">
                            KRA PIN <span className="text-theme-text-muted font-normal">(Optional)</span>
                          </Label>
                          <Input
                            id="kraPin"
                            placeholder="Enter KRA PIN"
                            className="h-9 border-theme-border focus:border-theme-primary"
                            value={onboardingData.kycDetails.kraPin}
                            onChange={(e) => updateOnboardingData('kycDetails', { kraPin: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maritalStatus" className="text-sm font-semibold text-theme-text">
                            Marital Status *
                          </Label>
                          <Select
                            value={onboardingData.kycDetails.maritalStatus}
                            onValueChange={(value) => updateOnboardingData('kycDetails', { maritalStatus: value })}
                          >
                            <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Children Information */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-theme-text">
                            Do you have children? *
                          </Label>
                          <Select
                            value={onboardingData.kycDetails.hasChildren}
                            onValueChange={(value) => updateOnboardingData('kycDetails', { 
                              hasChildren: value,
                              numberOfChildren: value === "no" ? 0 : onboardingData.kycDetails.numberOfChildren
                            })}
                          >
                            <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {onboardingData.kycDetails.hasChildren === "yes" && (
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-theme-text">
                              Number of Children *
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-theme-border"
                                onClick={() => updateOnboardingData('kycDetails', { 
                                  numberOfChildren: Math.max(0, onboardingData.kycDetails.numberOfChildren - 1)
                                })}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                min="0"
                                className="h-9 text-center border-theme-border"
                                value={onboardingData.kycDetails.numberOfChildren}
                                onChange={(e) => updateOnboardingData('kycDetails', { 
                                  numberOfChildren: parseInt(e.target.value) || 0
                                })}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 border-theme-border"
                                onClick={() => updateOnboardingData('kycDetails', { 
                                  numberOfChildren: onboardingData.kycDetails.numberOfChildren + 1
                                })}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* International Work Experience */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-theme-text">
                          Have you worked outside Kenya before? *
                        </Label>
                        <Select
                          value={onboardingData.kycDetails.workedAbroad}
                          onValueChange={(value) => updateOnboardingData('kycDetails', { 
                            workedAbroad: value,
                            countriesWorked: value === "no" ? [] : onboardingData.kycDetails.countriesWorked
                          })}
                        >
                          <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>

                        {onboardingData.kycDetails.workedAbroad === "yes" && (
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-theme-text">
                              Select countries where you have worked *
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {onboardingData.kycDetails.countriesWorked.map((country) => (
                                <Badge key={country} variant="secondary" className="bg-theme-primary/10 text-theme-primary">
                                  {country}
                                  <X
                                    className="h-3 w-3 ml-1 cursor-pointer"
                                    onClick={() => updateOnboardingData('kycDetails', {
                                      countriesWorked: onboardingData.kycDetails.countriesWorked.filter(c => c !== country)
                                    })}
                                  />
                                </Badge>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCountriesModal(true)}
                                className="border-theme-border hover:bg-theme-primary/10"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Countries
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-theme-text">Work Experience - As a Domestic worker *</Label>
                        <Select
                          value={onboardingData.kycDetails.workExperience}
                          onValueChange={(value) => updateOnboardingData('kycDetails', { workExperience: value })}
                        >
                          <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">My first time</SelectItem>
                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-7">5-7 years</SelectItem>
                            <SelectItem value="7+">7+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-theme-text">Skills & Expertise *</Label>
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                          {[
                            "House Cleaning", "Cooking", "Childcare", "Elderly Care", 
                            "Laundry & Ironing", "Pet Care", "Gardening", "Driving",
                            "First Aid", "Swimming", "Tutoring", "House Management"
                          ].map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-theme-primary/5 transition-colors border-theme-border"
                            >
                              <Checkbox
                                id={skill.toLowerCase().replace(/\s+/g, "-")}
                                checked={onboardingData.kycDetails.skills.includes(skill)}
                                onCheckedChange={(checked) => {
                                  const skills = checked
                                    ? [...onboardingData.kycDetails.skills, skill]
                                    : onboardingData.kycDetails.skills.filter(s => s !== skill)
                                  updateOnboardingData('kycDetails', { skills })
                                }}
                              />
                              <label
                                htmlFor={skill.toLowerCase().replace(/\s+/g, "-")}
                                className="text-sm cursor-pointer flex-1 text-theme-text"
                              >
                                {skill}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-theme-text">Languages *</Label>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="english" className="text-xs text-theme-text">English Level</Label>
                            <Select
                              value={onboardingData.kycDetails.languages.english}
                              onValueChange={(value) => updateOnboardingData('kycDetails', { 
                                languages: { ...onboardingData.kycDetails.languages, english: value }
                              })}
                            >
                              <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="fluent">Fluent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="swahili" className="text-xs text-theme-text">Swahili Level</Label>
                            <Select
                              value={onboardingData.kycDetails.languages.swahili}
                              onValueChange={(value) => updateOnboardingData('kycDetails', { 
                                languages: { ...onboardingData.kycDetails.languages, swahili: value }
                              })}
                            >
                              <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="fluent">Fluent</SelectItem>
                                <SelectItem value="native">Native</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="arabic" className="text-xs text-theme-text">Arabic Level</Label>
                            <Select
                              value={onboardingData.kycDetails.languages.arabic}
                              onValueChange={(value) => updateOnboardingData('kycDetails', { 
                                languages: { ...onboardingData.kycDetails.languages, arabic: value }
                              })}
                            >
                              <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="fluent">Fluent</SelectItem>
                                <SelectItem value="native">Native</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Documents */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
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
                        currentImage={onboardingData.documents.profilePicture}
                        onFileSelect={async (file) => await handleFileUpload(file, 'profilePicture')}
                        aspectRatio="square"
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <ImageUploadWithPreview
                          id="idDocumentFront"
                          label="National ID Front *"
                          required={true}
                          currentImage={onboardingData.documents.idDocumentFront}
                          onFileSelect={async (file) => await handleFileUpload(file, 'idDocumentFront')}
                          aspectRatio="rectangle"
                          showChangeOption={true}
                        />

                        <ImageUploadWithPreview
                          id="idDocumentBack"
                          label="National ID Back *"
                          required={true}
                          currentImage={onboardingData.documents.idDocumentBack}
                          onFileSelect={async (file) => await handleFileUpload(file, 'idDocumentBack')}
                          aspectRatio="rectangle"
                          showChangeOption={true}
                        />
                      </div>

                      <DocumentUploadField
                        id="passportDocument"
                        label="Passport Document"
                        required={false}
                        optional={true}
                        currentFile={onboardingData.documents.passportDocument}
                        onFileSelect={async (file) => await handleFileUpload(file, 'passport')}
                        onSkip={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            documents: { ...prev.documents, passportDocument: 'skipped' }
                          }))
                        }}
                      />

                      <DocumentUploadField
                        id="kraDocument"
                        label="KRA PIN Certificate"
                        required={false}
                        optional={true}
                        currentFile={onboardingData.documents.kraDocument}
                        onFileSelect={async (file) => await handleFileUpload(file, 'kra')}
                        onSkip={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            documents: { ...prev.documents, kraDocument: 'skipped' }
                          }))
                        }}
                      />

                      <DocumentUploadField
                        id="goodConductDocument"
                        label="Certificate of Good Conduct"
                        required={false}
                        optional={true}
                        currentFile={onboardingData.documents.goodConductUrl}
                        onFileSelect={async (file) => await handleFileUpload(file, 'goodConduct')}
                        onSkip={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            documents: { ...prev.documents, goodConductUrl: 'skipped' }
                          }))
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Face Verification */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Camera className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-text mb-1">Face Verification</h3>
                          <p className="text-theme-text-muted text-sm">
                            We'll compare your profile picture with your ID photo to verify your identity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Profile Picture */}
                      <Card className="bg-theme-background border-theme-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                            <User className="h-4 w-4 text-theme-primary" />
                            Profile Picture
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {onboardingData.documents.profilePicture ? (
                            <div className="aspect-square rounded-lg border-2 border-theme-primary/30 overflow-hidden">
                              <img 
                                src={onboardingData.documents.profilePicture} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square rounded-lg border-2 border-dashed border-theme-border flex items-center justify-center">
                              <p className="text-theme-text-muted text-sm">No profile picture</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* ID Photo */}
                      <Card className="bg-theme-background border-theme-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                            <IdCard className="h-4 w-4 text-theme-primary" />
                            ID Photo
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {onboardingData.documents.idDocumentFront ? (
                            <div className="aspect-[4/3] rounded-lg border-2 border-theme-primary/30 overflow-hidden">
                              <img 
                                src={onboardingData.documents.idDocumentFront} 
                                alt="ID" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-theme-border flex items-center justify-center">
                              <p className="text-theme-text-muted text-sm">No ID document</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div 
                      className="rounded-lg border-2 p-6 text-center"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      {onboardingData.verification.faceVerified ? (
                        <div className="space-y-4">
                          <div className="h-16 w-16 rounded-full bg-theme-success/20 border-2 border-theme-success flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="h-8 w-8 text-theme-success" />
                          </div>
                          <p className="text-lg font-semibold text-theme-success">Face Verification Successful!</p>
                          <p className="text-sm text-theme-text-muted">Your identity has been verified with 95% match confidence.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-center space-x-2 mb-4">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-theme-primary rounded-full"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                          
                          <p className="text-lg font-semibold text-theme-text">Ready for Face Verification</p>
                          <p className="text-sm text-theme-text-muted mb-4">
                            Click the button below to start the facial recognition process.
                          </p>
                          
                          <Button 
                            onClick={simulateFaceVerification}
                            disabled={saving || !onboardingData.documents.profilePicture || !onboardingData.documents.idDocumentFront}
                            className="text-white"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          >
                            {saving ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Camera className="h-4 w-4 mr-2" />
                                Start Face Verification
                              </>
                            )}
                          </Button>
                          
                          {(!onboardingData.documents.profilePicture || !onboardingData.documents.idDocumentFront) && (
                            <p className="text-sm text-theme-error mt-2">
                              Please upload both profile picture and ID document first.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 6: Photo Studio */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Camera className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-text mb-1">Professional Photo Session</h3>
                          <p className="text-theme-text-muted text-sm">
                            Visit one of our partner studios for professional photos. This service is completely free for verification purposes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Card className="bg-theme-background border-theme-border">
                      <CardHeader>
                        <CardTitle className="text-sm text-theme-text">County of Residence: {onboardingData.personalInfo.county || "Not selected"}</CardTitle>
                        <CardDescription className="text-theme-text-muted">
                          Below are the available photo studios in your county
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { name: "Picha Clear Aneps Studio", location: "Nairobi CBD", distance: "2.5 km", rating: "4.8" },
                          { name: "Professional Shots Studio", location: "Westlands, Nairobi", distance: "5.1 km", rating: "4.6" },
                          { name: "Quick Snap Studio", location: "Thika Road, Nairobi", distance: "8.3 km", rating: "4.4" },
                        ].map((studio, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg border-theme-border">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-theme-text">{studio.name}</p>
                                <Badge variant="outline" className="bg-theme-success/10 text-theme-success border-theme-success/30">
                                  Free
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-theme-text-muted">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {studio.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>•</span>
                                  {studio.distance}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>•</span>
                                  ⭐ {studio.rating}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8 text-xs border-theme-border">
                                <MapPin className="h-3 w-3 mr-1" />
                                Directions
                              </Button>
                              <Button size="sm" className="h-8 text-xs text-white" style={{ backgroundColor: currentTheme.colors.primary }}>
                                <Calendar className="h-3 w-3 mr-1" />
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.success}30`,
                        backgroundColor: `${currentTheme.colors.success}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-theme-success mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-success mb-1">Cost: KES 0</h3>
                          <p className="text-theme-text-muted text-sm">
                            The professional photo session is completely free as part of your verification process. 
                            This ensures we have high-quality photos for your profile that meet international standards.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Payment */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.primary}30`,
                        backgroundColor: `${currentTheme.colors.primary}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-text mb-1">Registration Payment</h3>
                          <p className="text-theme-text-muted text-sm">
                            Complete your registration with our one-time payment. This unlocks full access to international job opportunities.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trust Building Section */}
                    <Card className="bg-theme-background border-theme-border">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                          <Shield className="h-4 w-4 text-theme-success" />
                          Why Verify with Kazipert?
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-3 text-sm">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-theme-text">Access International Jobs</span>
                              <p className="text-theme-text-muted">Connect with employers in Oman, UAE, Qatar and more</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-theme-text">Verified Profile Badge</span>
                              <p className="text-theme-text-muted">Stand out to employers with verified credentials</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-theme-text">Priority Job Matching</span>
                              <p className="text-theme-text-muted">Get matched with the best opportunities first</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-theme-text">Dedicated Support</span>
                              <p className="text-theme-text-muted">24/7 support throughout your employment journey</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-theme-background border-theme-border">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                          <Receipt className="h-4 w-4 text-theme-text-muted" />
                          Invoice Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-theme-border">
                          <span className="text-sm text-theme-text">Registration Fee</span>
                          <span className="font-semibold text-theme-text">KES 200</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-theme-border">
                          <span className="text-sm text-theme-text">Verification Services</span>
                          <span className="text-theme-success">KES 0</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-theme-border">
                          <span className="text-sm text-theme-text">Photo Studio Session</span>
                          <span className="text-theme-success">KES 0</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-semibold text-theme-text">Total Amount</span>
                          <span className="font-bold text-lg text-theme-text">KES 200</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-theme-text">
                          MPesa Payment
                        </Label>
                        <div className="space-y-2">
                          <Label htmlFor="mpesaNumber" className="text-sm text-theme-text">
                            MPesa Phone Number *
                          </Label>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Input
                                id="mpesaNumber"
                                type="tel"
                                placeholder="07XX XXX XXX"
                                className="h-10 border-theme-border focus:border-theme-primary text-base"
                                value={onboardingData.payment.mpesaNumber}
                                onChange={(e) => updateOnboardingData('payment', { mpesaNumber: e.target.value })}
                                disabled={onboardingData.payment.payLater}
                              />
                            </div>
                            <Button 
                              onClick={processPayment}
                              disabled={saving || !onboardingData.payment.mpesaNumber || onboardingData.payment.payLater}
                              className="h-10 px-6 text-white text-base"
                              style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Smartphone className="h-4 w-4 mr-2" />
                                  Pay Now
                                </>
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-theme-text-muted">
                            You will receive an STK push on your phone to complete the payment of KES 200.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 rounded-lg border-2 p-4 border-theme-border">
                        <Checkbox 
                          id="payLater"
                          checked={onboardingData.payment.payLater}
                          onCheckedChange={(checked) => {
                            updateOnboardingData('payment', { 
                              payLater: checked as boolean,
                              mpesaNumber: checked ? "" : onboardingData.payment.mpesaNumber
                            })
                          }}
                        />
                        <label htmlFor="payLater" className="text-sm cursor-pointer text-theme-text flex-1">
                          <span className="font-medium">I will pay later</span>
                          <p className="text-theme-text-muted mt-1">
                            I understand that I need to complete this payment before I can be matched with international employers. 
                            I can continue browsing local opportunities in the meantime.
                          </p>
                        </label>
                      </div>

                      {onboardingData.verification.paymentVerified && (
                        <div className="rounded-lg border-2 border-theme-success/20 bg-theme-success/10 p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-theme-success" />
                            <span className="font-semibold text-theme-success">Payment Successful!</span>
                          </div>
                          <p className="text-sm text-theme-text-muted mt-1">
                            Your registration fee has been processed successfully. You now have full access to international job opportunities.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 8: Summary */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div 
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: `${currentTheme.colors.success}30`,
                        backgroundColor: `${currentTheme.colors.success}05`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-theme-success mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-theme-success mb-1">Application Complete! 🎉</h3>
                          <p className="text-theme-text-muted text-sm">
                            Your profile is now ready for verification. Here's a summary of your application.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {/* Personal Information */}
                      <Card className="bg-theme-background border-theme-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                            <User className="h-4 w-4 text-theme-primary" />
                            Personal Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-theme-text-muted">Full Name:</span>
                            <span className="font-medium text-theme-text">{user.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme-text-muted">Date of Birth:</span>
                            <span className="font-medium text-theme-text">{onboardingData.personalInfo.dateOfBirth || "Not provided"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme-text-muted">County:</span>
                            <span className="font-medium text-theme-text">{onboardingData.personalInfo.county || "Not selected"}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* KYC Details */}
                      <Card className="bg-theme-background border-theme-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                            <IdCard className="h-4 w-4 text-theme-primary" />
                            KYC Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-theme-text-muted">ID Number:</span>
                            <span className="font-medium text-theme-text">{onboardingData.kycDetails.idNumber || "Not provided"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme-text-muted">Work Experience:</span>
                            <span className="font-medium text-theme-text">{onboardingData.kycDetails.workExperience || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme-text-muted">Skills:</span>
                            <span className="font-medium text-theme-text">{onboardingData.kycDetails.skills.length} selected</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Verification Status */}
                      <Card className="bg-theme-background border-theme-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-theme-text">Verification Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-theme-text">Face Verification</span>
                            <Badge variant={onboardingData.verification.faceVerified ? "default" : "secondary"}>
                              {onboardingData.verification.faceVerified ? "Verified" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-theme-text">Documents</span>
                            <Badge variant={
                              onboardingData.documents.profilePicture && 
                              onboardingData.documents.idDocumentFront && 
                              onboardingData.documents.idDocumentBack 
                                ? "default" 
                                : "secondary"
                            }>
                              {onboardingData.documents.profilePicture && 
                               onboardingData.documents.idDocumentFront && 
                               onboardingData.documents.idDocumentBack 
                                ? "Uploaded" 
                                : "Incomplete"
                              }
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-theme-text">Payment Status</span>
                            <Badge variant={onboardingData.verification.paymentVerified ? "default" : "secondary"}>
                              {onboardingData.verification.paymentVerified ? "Paid" : "Pending"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Next Steps */}
                    <Card className="bg-theme-background border-theme-border">
                      <CardHeader>
                        <CardTitle className="text-sm text-theme-text">What Happens Next?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 text-sm">
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-theme-primary">1</span>
                            </div>
                            <div>
                              <span className="font-medium text-theme-text">Document Verification</span>
                              <p className="text-theme-text-muted">Our team will verify your documents within 24-48 hours</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-theme-primary">2</span>
                            </div>
                            <div>
                              <span className="font-medium text-theme-text">Profile Activation</span>
                              <p className="text-theme-text-muted">Once verified, your profile will be activated for job matching</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-theme-primary">3</span>
                            </div>
                            <div>
                              <span className="font-medium text-theme-text">Job Matching</span>
                              <p className="text-theme-text-muted">We'll match you with suitable international employers</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => router.push('/worker/jobs')}
                        className="flex-1 text-white font-semibold text-base py-2.5"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      >
                        <Briefcase className="h-5 w-5 mr-2" />
                        Browse Available Jobs
                      </Button>
                      <Button
                        onClick={async () => {
                          await saveProgress(totalSteps, onboardingData)
                          router.push('/worker/dashboard')
                        }}
                        variant="outline"
                        className="border-theme-border hover:bg-theme-primary/10"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-theme-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-10 border-theme-border hover:bg-theme-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="h-10 text-white text-base px-6"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showCountyModal && <CountyModal />}
      {showCountriesModal && <CountriesModal />}
    </PortalLayout>
  )
}