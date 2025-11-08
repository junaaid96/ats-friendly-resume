/**
 * Validation utilities for resume form
 * Provides type-safe validation functions for all form fields
 */

export interface ValidationErrors {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    github?: string;
  };
  summary?: string;
  experience?: Record<number, {
    company?: string;
    position?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    responsibilities?: Record<number, string>;
  }>;
  education?: Record<number, {
    institution?: string;
    degree?: string;
    field?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: string;
  projects?: Record<number, {
    name?: string;
    description?: string;
    technologies?: string;
    link?: string;
  }>;
  certifications?: Record<number, {
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): string | undefined {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Validates phone number format
 * Accepts various formats: (123) 456-7890, 123-456-7890, 123.456.7890, +1 123 456 7890, etc.
 */
export function validatePhone(phone: string): string | undefined {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return 'Please enter a valid phone number (at least 10 digits)';
  }
  if (digitsOnly.length > 15) {
    return 'Phone number is too long';
  }
  return undefined;
}

/**
 * Validates URL format
 */
export function validateUrl(url: string, fieldName: string): string | undefined {
  if (!url || url.trim() === '') {
    return undefined; // URLs are optional
  }
  try {
    // Allow URLs without protocol, but validate the format
    let urlToValidate = url.trim();
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
      urlToValidate = `https://${urlToValidate}`;
    }
    new URL(urlToValidate);
    return undefined;
  } catch {
    return `Please enter a valid ${fieldName} URL`;
  }
}

/**
 * Validates required text field
 */
export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
}

/**
 * Validates text length
 */
export function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): string | undefined {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  const length = value.trim().length;
  if (length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (length > max) {
    return `${fieldName} must be no more than ${max} characters`;
  }
  return undefined;
}

/**
 * Validates date format (YYYY-MM for month input)
 */
export function validateDate(date: string, fieldName: string): string | undefined {
  if (!date || date.trim() === '') {
    return `${fieldName} is required`;
  }
  const dateRegex = /^\d{4}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return `Please enter a valid ${fieldName}`;
  }
  return undefined;
}

/**
 * Validates that end date is after start date
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
  fieldName: string
): string | undefined {
  if (!startDate || !endDate) {
    return undefined; // Let individual date validation handle missing dates
  }
  if (new Date(endDate) < new Date(startDate)) {
    return `${fieldName} must be after start date`;
  }
  return undefined;
}

/**
 * Validates GPA format (e.g., 3.5, 3.50, 4.0)
 */
export function validateGpa(gpa: string): string | undefined {
  if (!gpa || gpa.trim() === '') {
    return undefined; // GPA is optional
  }
  const gpaRegex = /^\d\.\d{1,2}$/;
  const numericValue = parseFloat(gpa);
  if (!gpaRegex.test(gpa) || numericValue < 0 || numericValue > 4.0) {
    return 'Please enter a valid GPA (0.0 to 4.0)';
  }
  return undefined;
}

/**
 * Validates summary length
 */
export function validateSummary(summary: string): string | undefined {
  if (!summary || summary.trim() === '') {
    return 'Professional summary is required';
  }
  const length = summary.trim().length;
  if (length < 50) {
    return 'Summary must be at least 50 characters';
  }
  if (length > 500) {
    return 'Summary must be no more than 500 characters';
  }
  return undefined;
}

/**
 * Validates skills array
 */
export function validateSkills(skills: string[]): string | undefined {
  if (!skills || skills.length === 0) {
    return 'At least one skill is required';
  }
  return undefined;
}

/**
 * Validates that at least one responsibility is provided for work experience
 */
export function validateResponsibilities(
  responsibilities: string[]
): string | undefined {
  if (!responsibilities || responsibilities.length === 0) {
    return 'At least one responsibility is required';
  }
  const hasNonEmptyResponsibility = responsibilities.some(
    (resp) => resp && resp.trim() !== ''
  );
  if (!hasNonEmptyResponsibility) {
    return 'At least one responsibility is required';
  }
  return undefined;
}

