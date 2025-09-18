import {BrevoMailService} from "#services/core/brevo_mail.service";
import {inject} from "@adonisjs/core";

@inject()
export class NotificationService {
    constructor(private mailService: BrevoMailService) {
    }

    /**
     * Sends an OTP
     * @param to Recipient email address
     * @param otp OTP code
     */
    async sendOtp(to: string, {otp, otpToken}: { otp: string, otpToken: string }): Promise<void> {
        const subject = 'Your OTP Code';
        const htmlContent = `
      <div style="
        font-family: 'Helvetica', Arial, sans-serif; 
        text-align: center; 
        background-color: #f9f9f9; 
        padding: 40px 20px;
      ">
        <div style="
          display: inline-block; 
          background-color: #ffffff; 
          padding: 30px 20px; 
          border-radius: 12px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
          <h2 style="color: #333;">Hello!</h2>
          <p style="color: #555; font-size: 16px;">Your OTP code is:</p>
          <div style="
            font-size: 36px; 
            font-weight: bold; 
            letter-spacing: 8px; 
            color: #1e90ff; 
            margin: 20px 0;
          ">${otp}</div>
          <div>${otpToken}</div>
          <a href="${otpToken}" style="
            display: inline-block; 
            padding: 12px 25px; 
            background-color: #1e90ff; 
            color: #fff; 
            text-decoration: none; 
            border-radius: 6px;
            font-weight: 500;
          ">Verify Now</a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `;

        try {
            await this.mailService.sendMail(to, subject, htmlContent);
        } catch (err) {
            console.error('Failed to send OTP:', err);
            throw err;
        }
    }


    async sendForgotPassword(to: string,token:string): Promise<void> {
        const subject = 'Your OTP Code';
        const htmlContent = `
      <div style="
        font-family: 'Helvetica', Arial, sans-serif; 
        text-align: center; 
        background-color: #f9f9f9; 
        padding: 40px 20px;
      ">
        <div style="
          display: inline-block; 
          background-color: #ffffff; 
          padding: 30px 20px; 
          border-radius: 12px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
          <h2 style="color: #333;">Hello!</h2>
          <p style="color: #555; font-size: 16px;">Your OTP code is:</p>
   
          <div>${token}</div>
          <a href="${token}" style="
            display: inline-block; 
            padding: 12px 25px; 
            background-color: #1e90ff; 
            color: #fff; 
            text-decoration: none; 
            border-radius: 6px;
            font-weight: 500;
          ">Verify Now</a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `;

        try {
            await this.mailService.sendMail(to, subject, htmlContent);
        } catch (err) {
            console.error('Failed to send OTP:', err);
            throw err;
        }
    }
}
