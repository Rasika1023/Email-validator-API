
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidationResult, downloadResultsCSV } from "@/utils/csvParser";
import { Input } from "@/components/ui/input";

interface ResultsProps {
  results: ValidationResult[];
  isLoading?: boolean;
}

const Results: React.FC<ResultsProps> = ({ results, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState<string>("all");

  const validCount = results.filter((result) => result.valid).length;
  const invalidCount = results.length - validCount;

  const filteredResults = results.filter((result) => {
    // Filter by search term
    const matchesSearch = result.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "valid" && result.valid) ||
      (currentTab === "invalid" && !result.valid);
    
    return matchesSearch && matchesTab;
  });

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadResultsCSV(results, `email-validation-results-${timestamp}`);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl">Validation Results</CardTitle>
          <Button 
            variant="default"
            disabled={isLoading || results.length === 0}
            onClick={handleDownload}
            className="shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download CSV
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center mt-4">
          <div className="flex flex-wrap gap-2">
            <div className="bg-background rounded-full px-3 py-1 text-sm">
              Total: <span className="font-semibold">{results.length}</span>
            </div>
            <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
              Valid: <span className="font-semibold">{validCount}</span>
            </div>
            <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm">
              Invalid: <span className="font-semibold">{invalidCount}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="valid">Valid</TabsTrigger>
            <TabsTrigger value="invalid">Invalid</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="m-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-pulse-light flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-muted-foreground/70 animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <p className="mt-4 text-muted-foreground">Validating emails...</p>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex justify-center items-center p-8 text-muted-foreground">
                {results.length === 0 
                  ? "No results available. Upload a CSV file to validate emails."
                  : "No matching results found."}
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result, index) => (
                      <tr 
                        key={index} 
                        className={`border-b hover:bg-muted/50 ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }`}
                      >
                        <td className="p-3 text-sm">{result.email}</td>
                        <td className="p-3 text-sm">
                          {result.valid ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Invalid
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {result.reason || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Results;
