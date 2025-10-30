import { prisma } from '@/lib/prisma';
import { smsService } from './smsService';
import { emailService } from './emailService';

export interface OtpSendResult {
    success: boolean;
    message?: string;
    error?: string;
    debugOtp?: string; // Only for development
}

export interface OtpVerifyResult {
    success: boolean;
    verified: boolean;
    message?: string;
    error?: string;
}

export class OtpService {
    private readonly OTP_EXPIRY_MINUTES = 10;
    private readonly OTP_LENGTH = 4;

    generateOtp(): string {
        return Math.floor(
            Math.pow(10, this.OTP_LENGTH - 1) +
            Math.random() * 9 * Math.pow(10, this.OTP_LENGTH - 1)
        ).toString();
    }

    async sendPhoneOtp(phone: string): Promise<OtpSendResult> {
        try {
            console.log('Sending phone OTP to:', phone);

            if (!phone) {
                return {
                    success: false,
                    error: 'Phone number is required',
                };
            }

            // Check if phone is already verified for an existing user
            const existingUser = await prisma.user.findUnique({
                where: { phone }
            });

            if (existingUser && existingUser.phoneVerified) {
                return {
                    success: false,
                    error: 'Phone number is already verified and in use',
                };
            }

            // Generate OTP
            const otp = this.generateOtp();
            const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

            console.log(`Generated OTP for phone ${phone}: ${otp}`);

            // Store OTP in database
            await prisma.otpVerification.create({
                data: {
                    phone,
                    otp,
                    type: 'PHONE',
                    expiresAt
                }
            });

            // Send SMS via Africa's Talking
            const smsResult = await smsService.sendOtp(phone, otp);

            if (!smsResult.success) {
                // In development, we can still proceed and log the OTP
                if (process.env.NODE_ENV === 'development') {
                    console.log(`📱 Development mode - Phone OTP for ${phone}: ${otp}`);
                    return {
                        success: true,
                        message: 'Verification code sent to phone',
                        debugOtp: otp,
                    };
                }

                return {
                    success: false,
                    error: `Failed to send SMS: ${smsResult.error}`,
                };
            }

            return {
                success: true,
                message: 'Verification code sent to your phone',
            };
        } catch (error: any) {
            console.error('Send phone OTP error:', error);
            return {
                success: false,
                error: 'Failed to send verification code: ' + error.message,
            };
        }
    }

    async sendEmailOtp(email: string): Promise<OtpSendResult> {
        try {
            console.log('Sending email OTP to:', email);

            if (!email) {
                return {
                    success: false,
                    error: 'Email is required',
                };
            }

            // Check if email is already verified for an existing user
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser && existingUser.emailVerified) {
                return {
                    success: false,
                    error: 'Email is already verified and in use',
                };
            }

            // Generate OTP
            const otp = this.generateOtp();
            const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

            console.log(`Generated OTP for email ${email}: ${otp}`);

            // Store OTP in database
            await prisma.otpVerification.create({
                data: {
                    email,
                    otp,
                    type: 'EMAIL',
                    expiresAt
                }
            });

            // Send email via Outlook 365
            const emailResult = await emailService.sendOtpEmail(email, otp);

            if (!emailResult.success) {
                // In development, we can still proceed and log the OTP
                if (process.env.NODE_ENV === 'development') {
                    console.log(`📧 Development mode - Email OTP for ${email}: ${otp}`);
                    return {
                        success: true,
                        message: 'Verification code sent to your email',
                        debugOtp: otp, // Include OTP for development
                    };
                }

                return {
                    success: false,
                    error: `Failed to send email: ${emailResult.error}`,
                };
            }

            return {
                success: true,
                message: 'Verification code sent to your email',
            };
        } catch (error: any) {
            console.error('Send email OTP error:', error);
            return {
                success: false,
                error: 'Failed to send verification code: ' + error.message,
            };
        }
    }

    async verifyPhoneOtp(phone: string, otp: string): Promise<OtpVerifyResult> {
        try {
            console.log('Verifying phone OTP:', { phone, otp });

            const verification = await prisma.otpVerification.findFirst({
                where: {
                    phone,
                    type: 'PHONE',
                    otp,
                    expiresAt: {
                        gt: new Date(),
                    },
                    verified: false,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            if (!verification) {
                return {
                    success: true,
                    verified: false,
                    error: 'Invalid or expired verification code',
                };
            }

            // Mark OTP as verified
            await prisma.otpVerification.update({
                where: { id: verification.id },
                data: { verified: true },
            });

            // Update user's phone verification status if user exists
            await prisma.user.updateMany({
                where: { phone },
                data: { phoneVerified: true },
            });

            return {
                success: true,
                verified: true,
                message: 'Phone number verified successfully',
            };
        } catch (error: any) {
            console.error('Verify phone OTP error:', error);
            return {
                success: false,
                verified: false,
                error: 'Verification failed: ' + error.message,
            };
        }
    }

    async verifyEmailOtp(email: string, otp: string): Promise<OtpVerifyResult> {
        try {
            console.log('Verifying email OTP:', { email, otp });

            const verification = await prisma.otpVerification.findFirst({
                where: {
                    email,
                    type: 'EMAIL',
                    otp,
                    expiresAt: {
                        gt: new Date(),
                    },
                    verified: false,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            if (!verification) {
                return {
                    success: true,
                    verified: false,
                    error: 'Invalid or expired verification code',
                };
            }

            // Mark OTP as verified
            await prisma.otpVerification.update({
                where: { id: verification.id },
                data: { verified: true },
            });

            // Update user's email verification status if user exists
            await prisma.user.updateMany({
                where: { email },
                data: { emailVerified: true },
            });

            return {
                success: true,
                verified: true,
                message: 'Email verified successfully',
            };
        } catch (error: any) {
            console.error('Verify email OTP error:', error);
            return {
                success: false,
                verified: false,
                error: 'Verification failed: ' + error.message,
            };
        }
    }
}

export const otpService = new OtpService();