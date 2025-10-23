"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
    terms: {
        accuracy: boolean
        terms: boolean
        consent: boolean
    }
}

export function useOnboarding(initialUser: any, initialProgress: any) {
    const router = useRouter()
    const [user, setUser] = useState<any>(initialUser)
    const [loading, setLoading] = useState(!initialUser)
    const [currentStep, setCurrentStep] = useState(1)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showCountyModal, setShowCountyModal] = useState(false)
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
        },
        terms: {
            accuracy: false,
            terms: false,
            consent: false
        }
    })

    useEffect(() => {
        if (initialProgress) {
            setCurrentStep(initialProgress.currentStep || 1)
            if (initialProgress.data) {
                setOnboardingData(prev => ({
                    ...prev,
                    ...initialProgress.data
                }))
            }
            setLoading(false)
        }
    }, [initialProgress])

    useEffect(() => {
        if (validationErrors.length > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [validationErrors])

    const saveProgress = async (step: number, data?: any) => {
        if (!user) return

        try {
            setSaving(true)
            const response = await fetch('/api/onboarding/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    currentStep: step,
                    data: data || onboardingData
                })
            })

            if (!response.ok) {
                throw new Error('Failed to save progress')
            }
        } catch (error) {
            console.error('Failed to save progress:', error)
            toast.error("Failed to save your progress. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const updateOnboardingData = (section: string, updates: any) => {
        setOnboardingData(prev => ({
            ...prev,
            [section]: { ...prev[section as keyof typeof prev], ...updates }
        }))

        // Auto-save on data changes
        if (user && !saving) {
            saveProgress(currentStep, {
                ...onboardingData,
                [section]: { ...onboardingData[section as keyof typeof onboardingData], ...updates }
            })
        }
    }

    const validateAge = (dateString: string): boolean => {
        if (!dateString) return false
        const birthDate = new Date(dateString)
        const today = new Date()
        const minAgeDate = new Date(today.getFullYear() - 22, today.getMonth(), today.getDate())
        return birthDate <= minAgeDate
    }

    const validateStep = (step: number): boolean => {
        const errors: string[] = []

        switch (step) {
            case 1:
                if (!onboardingData.terms.accuracy) errors.push("Please attest that all information provided is accurate")
                if (!onboardingData.terms.terms) errors.push("Please agree to the Terms of Service and Privacy Policy")
                if (!onboardingData.terms.consent) errors.push("Please consent to document verification and background checks")
                break

            case 2:
                if (!onboardingData.personalInfo.dateOfBirth) {
                    errors.push("Date of birth is required")
                } else if (!validateAge(onboardingData.personalInfo.dateOfBirth)) {
                    errors.push("You must be at least 22 years old")
                }
                if (!onboardingData.personalInfo.county) errors.push("County is required")
                if (!onboardingData.personalInfo.physicalAddress) errors.push("Physical address is required")
                break

            case 3:
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

            case 4:
                if (!onboardingData.documents.profilePicture) errors.push("Profile picture is required")
                if (!onboardingData.documents.idDocumentFront) errors.push("National ID front is required")
                if (!onboardingData.documents.idDocumentBack) errors.push("National ID back is required")
                break

            case 7:
                if (!onboardingData.payment.payLater && !onboardingData.payment.mpesaNumber)
                    errors.push("MPesa number is required or select 'I will pay later'")
                break
        }

        setValidationErrors(errors)

        if (errors.length > 0) {
            toast.error(`Please fix ${errors.length} error(s) before continuing`)
            setShowErrorModal(true)
        }

        return errors.length === 0
    }

    const nextStep = async () => {
        if (currentStep < 8) {
            if (validateStep(currentStep)) {
                const nextStepNum = currentStep + 1
                setCurrentStep(nextStepNum)
                await saveProgress(nextStepNum)
                setValidationErrors([])
                toast.success(`Moving to step ${nextStepNum}`)
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
        if (step >= 1 && step <= 8) {
            setCurrentStep(step)
            setValidationErrors([])
        }
    }

    return {
        user,
        loading,
        currentStep,
        onboardingData,
        validationErrors,
        saving,
        showErrorModal,
        showCountyModal,
        showCountriesModal,
        updateOnboardingData,
        nextStep,
        prevStep,
        goToStep,
        setShowErrorModal,
        setShowCountyModal,
        setShowCountriesModal,
        saveProgress
    }
}