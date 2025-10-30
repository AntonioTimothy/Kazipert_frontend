import { env } from '@/lib/env';
import { twilioService } from './twilioService';

export interface SmsSendOptions {
    to: string;
    message: string;
}

export interface SmsResponse {
    success: boolean;
    messageId?: string;
    error?: string;
    debugOtp?: string;
    provider?: 'africastalking' | 'twilio' | 'development';
}

export class SmsService {
    private apiKey: string;
    private username: string;
    private senderId: string;
    private baseUrl: string = 'https://api.sandbox.africastalking.com/version1';
    private isSandbox: boolean;

    // Approved sandbox test numbers
    private readonly SANDBOX_NUMBERS = [
        '254711082000', '254711082001', '254711082002', '254711082003', '254711082004',
        '254711082005', '254711082006', '254711082007', '254711082008', '254711082009'
    ];

    // Country codes
    private readonly KENYA_PREFIX = '254';
    private readonly OMAN_PREFIX = '968';

    constructor() {
        this.apiKey = env.AFRICASTALKING_API_KEY;
        this.username = env.AFRICASTALKING_USERNAME;
        this.senderId = env.AFRICASTALKING_SENDER_ID;
        this.isSandbox = this.username === 'sandbox';

        console.log('SMS Service initialized:', {
            environment: this.isSandbox ? 'SANDBOX' : 'LIVE',
            hasTwilio: !!env.TWILIO_ACCOUNT_SID
        });
    }

    async sendSms(options: SmsSendOptions): Promise<SmsResponse> {
        try {
            const normalizedNumber = this.normalizePhoneNumber(options.to);
            const country = this.detectCountry(normalizedNumber);

            console.log('🌍 SMS Routing Decision:', {
                original: options.to,
                normalized: normalizedNumber,
                country: country,
                environment: this.isSandbox ? 'SANDBOX' : 'LIVE'
            });

            // Route based on country
            if (country === 'oman') {
                console.log('🟢 Routing to Twilio WhatsApp for Oman number');
                return this.sendViaTwilioWhatsApp(options.message);
            } else if (country === 'kenya') {
                console.log('🟠 Routing to Africa\'s Talking for Kenya number');
                return this.sendViaAfricaTalking(normalizedNumber, options.message);
            } else {
                console.log('🔴 Unsupported country - using development fallback');
                return this.developmentFallback(options.message, `Unsupported country for number: ${normalizedNumber}`);
            }

        } catch (error: any) {
            console.error('💥 SMS sending error:', error);
            return this.developmentFallback(options.message, error.message);
        }
    }

    private async sendViaAfricaTalking(phone: string, message: string): Promise<SmsResponse> {
        try {
            console.log('Sending SMS via Africa\'s Talking to:', phone);

            // Validate phone number for sandbox
            if (this.isSandbox && !this.isApprovedSandboxNumber(phone)) {
                return this.developmentFallback(
                    message,
                    `Phone number not approved for sandbox. Use: ${this.SANDBOX_NUMBERS.slice(0, 3).join(', ')}`
                );
            }

            const formData = new URLSearchParams();
            formData.append('username', this.username);
            formData.append('to', phone);
            formData.append('message', message);

            // Only include from if we have a valid sender ID
            if (this.senderId && this.senderId.trim() !== '') {
                formData.append('from', this.senderId);
            }

            const url = `${this.baseUrl}/messaging`;

            console.log('Africa\'s Talking API Request:', {
                url,
                to: phone,
                senderId: this.senderId
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'apiKey': this.apiKey,
                },
                body: formData.toString(),
            });

            console.log('Africa\'s Talking API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Africa\'s Talking API error response:', errorText);

                // In development, fallback to showing OTP
                if (process.env.NODE_ENV === 'development') {
                    return this.developmentFallback(message, `Africa's Talking error: ${response.status} - ${errorText}`);
                }

                throw new Error(`SMS API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Africa\'s Talking API success response:', data);

            // Africa's Talking response structure
            if (data.SMSMessageData && data.SMSMessageData.Recipients) {
                const recipient = data.SMSMessageData.Recipients[0];
                if (recipient.status === 'Success') {
                    console.log('✅ Africa\'s Talking SMS sent successfully to Kenya');
                    return {
                        success: true,
                        messageId: recipient.messageId,
                        provider: 'africastalking'
                    };
                } else {
                    throw new Error(`SMS failed: ${recipient.status} - ${recipient.message}`);
                }
            }

            throw new Error('Invalid response from Africa\'s Talking API');
        } catch (error: any) {
            console.error('Africa\'s Talking error:', error);
            return this.developmentFallback(message, `Africa's Talking: ${error.message}`);
        }
    }

    private async sendViaTwilioWhatsApp(message: string): Promise<SmsResponse> {
        try {
            const otp = this.extractOtpFromMessage(message);

            console.log('🔢 Extracted OTP for Twilio:', otp);

            // Use your actual template with dynamic OTP
            console.log('🚀 Attempting to send via Twilio templated message...');
            let result = await twilioService.sendWhatsAppOtp(otp);

            if (!result.success) {
                console.log('🔄 Templated message failed, trying direct message...');
                result = await twilioService.sendDirectWhatsAppOtp(otp);
            }

            if (result.success) {
                console.log('✅ Twilio WhatsApp sent successfully to Oman number');
                return {
                    success: true,
                    messageId: result.messageId,
                    provider: 'twilio'
                };
            } else {
                throw new Error(`Twilio WhatsApp failed: ${result.error}`);
            }
        } catch (error: any) {
            console.error('💥 Twilio WhatsApp error:', error);
            return this.developmentFallback(message, `Twilio: ${error.message}`);
        }
    }

    async sendOtp(phoneNumber: string, otp: string): Promise<SmsResponse> {
        const message = `Your Kazipert verification code is: ${otp}. This code expires in 10 minutes.`;

        return this.sendSms({
            to: phoneNumber,
            message: message,
        });
    }

    private normalizePhoneNumber(phone: string): string {
        // Remove any non-digit characters except +
        let normalized = phone.replace(/[^\d+]/g, '');

        // Remove leading 0 and add 254 for Kenya
        if (normalized.startsWith('0')) {
            normalized = '254' + normalized.substring(1);
        }

        // Ensure it starts with 254 (no + for Africa's Talking API)
        if (normalized.startsWith('+254')) {
            normalized = normalized.substring(1); // Remove the +
        }

        // Ensure it starts with country code
        if (!normalized.startsWith('254') && !normalized.startsWith('968')) {
            normalized = '254' + normalized; // Default to Kenya
        }

        normalized = normalized.replace(/\s/g, '');

        console.log('Normalized phone number:', { original: phone, normalized });
        return normalized;
    }

    private detectCountry(phone: string): 'kenya' | 'oman' | 'other' {
        if (phone.startsWith(this.KENYA_PREFIX)) {
            return 'kenya';
        } else if (phone.startsWith(this.OMAN_PREFIX)) {
            return 'oman';
        } else {
            return 'other';
        }
    }

    private isApprovedSandboxNumber(phone: string): boolean {
        const cleanPhone = phone.startsWith('+') ? phone.substring(1) : phone;
        return this.SANDBOX_NUMBERS.includes(cleanPhone);
    }

    private developmentFallback(message: string, error: string): SmsResponse {
        // Always return success in development with debug OTP
        if (process.env.NODE_ENV === 'development') {
            const otp = this.extractOtpFromMessage(message);
            console.log(`📱 DEVELOPMENT MODE - OTP: ${otp} (Actual SMS failed: ${error})`);
            return {
                success: true,
                messageId: `DEV_${Date.now()}`,
                debugOtp: otp,
                provider: 'development'
            };
        }

        // In production, return actual error
        return {
            success: false,
            error: error,
        };
    }

    private extractOtpFromMessage(message: string): string {
        const otpMatch = message.match(/\b\d{4}\b/);
        return otpMatch ? otpMatch[0] : '1234';
    }

    getSandboxTestNumbers(): string[] {
        return this.SANDBOX_NUMBERS;
    }

    getSupportedCountries(): { kenya: string[]; oman: string[] } {
        return {
            kenya: this.SANDBOX_NUMBERS,
            oman: ['96894048842'] // Hardcoded Omani number for testing
        };
    }

    // Optional: Check account balance
    async getBalance(): Promise<{ balance: string; currency: string }> {
        try {
            const url = `https://api.africastalking.com/version1/user?username=${this.username}`;

            const response = await fetch(url, {
                headers: {
                    'apiKey': this.apiKey,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }

            const data = await response.json();
            return {
                balance: data.UserData.balance,
                currency: data.UserData.currency.code,
            };
        } catch (error) {
            console.error('Balance check error:', error);
            throw error;
        }
    }
}

export const smsService = new SmsService();