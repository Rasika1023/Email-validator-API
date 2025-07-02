
export interface ValidationResult {
  email: string;
  valid: boolean;
  reason: string;
}

/**
 * Validates an email address
 * @param email Email to validate
 * @returns ValidationResult object with validation details
 */
export function validateEmail(email: string): ValidationResult {
  // Trim the email to remove any whitespace
  const trimmedEmail = email.trim();
  
  // Basic check for empty email
  if (!trimmedEmail) {
    return {
      email: trimmedEmail,
      valid: false,
      reason: "Email is empty"
    };
  }

  // General format check using regex
  // This regex checks for:
  // - Local part (before @)
  // - @ symbol
  // - Domain part (after @)
  // - TLD (at least 2 characters after last dot)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      email: trimmedEmail,
      valid: false,
      reason: "Invalid email format"
    };
  }

  // Advanced checks
  const [localPart, domainPart] = trimmedEmail.split('@');

  // Check local part length
  if (localPart.length > 64) {
    return {
      email: trimmedEmail,
      valid: false,
      reason: "Local part exceeds 64 characters"
    };
  }

  // Check domain part length
  if (domainPart.length > 255) {
    return {
      email: trimmedEmail,
      valid: false,
      reason: "Domain part exceeds 255 characters"
    };
  }

  // Check for consecutive dots in domain
  if (domainPart.includes('..')) {
    return {
      email: trimmedEmail,
      valid: false,
      reason: "Domain contains consecutive dots"
    };
  }

  // Check for valid TLD (Top-Level Domain)
  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  
  if (tld.length < 2) {
    return {
      email: trimmedEmail,
      valid: false,
      reason: "TLD must be at least 2 characters"
    };
  }

  // If all checks pass, the email is valid
  return {
    email: trimmedEmail,
    valid: true,
    reason: ""
  };
}
