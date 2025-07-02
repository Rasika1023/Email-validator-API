import { ValidationResult, validateEmail } from "./emailValidator";

/**
 * Parses a CSV file and extracts emails
 * @param file CSV file to parse
 * @returns Promise that resolves to an array of emails
 */
export function parseEmailsFromCSV(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('Failed to read file');
        }
        
        const csvContent = event.target.result;
        const rows = csvContent.split('\n');
        
        // Look for emails in the CSV
        // We'll try to find a column that contains emails
        const headerRow = rows[0].trim();
        const headers = headerRow.split(',').map(header => header.trim().toLowerCase());
        
        // Try to find an email column
        let emailColumnIndex = headers.findIndex(header => 
          header === 'email' || 
          header === 'email address' || 
          header.includes('email')
        );
        
        // If we can't find an explicit email column, we'll use the first column
        if (emailColumnIndex === -1) emailColumnIndex = 0;
        
        // Extract emails from the identified column
        const emails: string[] = [];
        
        // Start from index 1 to skip header row
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty rows
          
          const columns = rows[i].split(',').map(col => col.trim());
          
          // Only add if the column exists and is not empty
          if (columns[emailColumnIndex] && columns[emailColumnIndex].trim()) {
            emails.push(columns[emailColumnIndex].trim());
          }
        }
        
        resolve(emails);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading the CSV file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validates all emails from a list
 * @param emails Array of emails to validate
 * @returns Array of ValidationResult objects
 */
export function validateEmails(emails: string[]): ValidationResult[] {
  return emails.map(email => validateEmail(email));
}

/**
 * Validates emails in parallel using web workers
 * @param emails Array of emails to validate
 * @param batchSize Number of emails to process in each batch
 * @returns Promise that resolves to an array of ValidationResult objects
 */
export function validateEmailsParallel(
  emails: string[],
  batchSize: number = 100
): Promise<ValidationResult[]> {
  // If the list is small, process it directly without parallelization
  if (emails.length <= batchSize) {
    return Promise.resolve(validateEmails(emails));
  }

  return new Promise((resolve) => {
    const batches = [];
    const results: ValidationResult[] = [];
    let processed = 0;

    // Split emails into batches
    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize));
    }

    // Process each batch
    batches.forEach((batch) => {
      // We're using setTimeout to simulate parallel processing without actually
      // creating Web Workers (which would require separate files)
      setTimeout(() => {
        const batchResults = validateEmails(batch);
        results.push(...batchResults);
        processed++;

        // When all batches are processed, resolve the promise
        if (processed === batches.length) {
          resolve(results);
        }
      }, 0);
    });
  });
}

/**
 * Converts validation results to CSV format
 * @param results Array of ValidationResult objects
 * @returns CSV content as a string
 */
export function resultsToCSV(results: ValidationResult[]): string {
  // Add headers
  let csv = 'email,valid,reason\n';
  
  // Add data rows
  results.forEach(result => {
    // Escape quotes and handle commas in the email and reason fields
    const escapedEmail = `"${result.email.replace(/"/g, '""')}"`;
    const escapedReason = `"${result.reason.replace(/"/g, '""')}"`;
    
    csv += `${escapedEmail},${result.valid ? 'yes' : 'no'},${escapedReason}\n`;
  });
  
  return csv;
}

/**
 * Generates a downloadable CSV file from validation results
 * @param results Array of ValidationResult objects
 * @param filename Name for the downloaded file
 */
export function downloadResultsCSV(results: ValidationResult[], filename: string = 'email-validation-results'): void {
  const csv = resultsToCSV(results);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Re-export ValidationResult to fix the import issue
export type { ValidationResult } from "./emailValidator";
