import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/FileUploader";
import Results from "@/components/Results";
import MainLayout from "@/components/layout/MainLayout";
import { parseEmailsFromCSV, validateEmailsParallel } from "@/utils/csvParser";
import { ValidationResult } from "@/utils/emailValidator";

const Index: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsValidated(false);
  };

  const handleValidate = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a CSV file to validate.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Parse the CSV and get emails
      const emails = await parseEmailsFromCSV(file);
      
      if (emails.length === 0) {
        toast({
          title: "No emails found",
          description: "The CSV file doesn't contain any valid email addresses.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      // Use parallel processing for validation (with batch size based on email count)
      const batchSize = Math.max(50, Math.min(100, Math.floor(emails.length / 10)));
      const validationResults = await validateEmailsParallel(emails, batchSize);
      
      setResults(validationResults);
      setIsValidated(true);
      
      const validCount = validationResults.filter(r => r.valid).length;
      
      toast({
        title: "Validation complete",
        description: `Processed ${emails.length} emails. ${validCount} valid, ${emails.length - validCount} invalid.`,
      });
    } catch (error) {
      console.error("Error processing the file:", error);
      toast({
        title: "Error processing file",
        description: "Failed to process the CSV file. Please make sure it's properly formatted.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearResults = () => {
    setResults([]);
    setFile(null);
    setIsValidated(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Email Validator</CardTitle>
            <CardDescription>
              Upload a CSV file containing email addresses to validate them in bulk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUploader onFileSelect={handleFileSelect} />
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <Button 
                onClick={handleValidate} 
                disabled={!file || isProcessing} 
                className="w-full sm:w-auto"
              >
                {isProcessing ? "Processing..." : "Validate Emails"}
              </Button>
              
              {isValidated && (
                <Button 
                  variant="outline" 
                  onClick={handleClearResults}
                  className="w-full sm:w-auto"
                >
                  Clear Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {(results.length > 0 || isProcessing) && (
          <Results results={results} isLoading={isProcessing} />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg border">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">1. Upload CSV</h3>
                <p className="text-muted-foreground text-sm">
                  Upload your CSV file containing email addresses. The app will automatically detect the email column.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg border">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">2. Validate</h3>
                <p className="text-muted-foreground text-sm">
                  The system checks each email for correct format, valid domains, and other common issues.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg border">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">3. Download Results</h3>
                <p className="text-muted-foreground text-sm">
                  Download a CSV with your emails and validation results, including reasons for any invalid emails.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
