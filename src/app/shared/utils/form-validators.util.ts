import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Custom form validators utility
 */
export class FormValidators {
  
  /**
   * Validates name fields (first name, last name)
   * Allows only letters, spaces, hyphens, and apostrophes
   * Prevents consecutive special characters
   * @param control - The form control to validate
   * @returns ValidationErrors object if invalid, null if valid
   */
  static nameValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    
    if (!value) {
      return null;
    }

    // Pattern allows letters, spaces, hyphens, and apostrophes
    const validCharacterPattern = /^[a-zA-Z\s\-']+$/;
    
    // Pattern to detect consecutive special characters (spaces, hyphens, apostrophes)
    const consecutiveSpecialCharsPattern = /[\s\-']{2,}/;
    
    // Check if value contains only valid characters
    if (!validCharacterPattern.test(value)) {
      return { pattern: true };
    }
    
    // Check for consecutive special characters
    if (consecutiveSpecialCharsPattern.test(value)) {
      return { pattern: true };
    }
    
    // Check if trimmed value is empty (only whitespace)
    if (value.trim().length === 0) {
      return { pattern: true };
    }
    
    return null;
  }

  /**
   * Validates email uniqueness (to be used with async validation)
   * @param existingEmails - Array of existing email addresses
   * @param currentEmail - Current email (for edit mode)
   * @returns Function that validates email uniqueness
   */
  static emailUniquenessValidator(existingEmails: string[], currentEmail?: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const email: string = control.value;
      
      if (!email) {
        return null;
      }
      
      const emailExists = existingEmails.some(
        existingEmail => 
          existingEmail.toLowerCase() === email.toLowerCase() && 
          existingEmail !== currentEmail
      );
      
      return emailExists ? { emailExists: true } : null;
    };
  }
}