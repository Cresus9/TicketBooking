import { securityAPI } from './api';

export interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  userId?: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export interface BlockedIP {
  ip: string;
  reason: string;
  timestamp: string;
  expiresAt: string;
}

class SecurityService {
  async verifyRecaptcha(token: string): Promise<boolean> {
    try {
      const response = await securityAPI.verifyRecaptcha(token);
      return response.data.success;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }

  async reportSuspiciousActivity(data: {
    action: string;
    ip: string;
    details: string;
    severity: SecurityLog['severity'];
  }): Promise<void> {
    await securityAPI.reportSuspiciousActivity(data);
  }

  async checkIPStatus(ip: string): Promise<{ blocked: boolean; reason?: string }> {
    const response = await securityAPI.checkIPStatus(ip);
    return response.data;
  }

  validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  sanitizeInput(input: string): string {
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

export const securityService = new SecurityService();