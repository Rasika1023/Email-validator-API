# Email Validator – Web-Based Email Verification Tool

A modern web application to validate email addresses in bulk via a sleek, user-friendly interface. Upload your CSV file, and get an CSV report with verified results — fast, accurate, and downloadable.

##  Live Web App Overview
 Upload a CSV file →  Validate Email Format & Domain →  Download Clean CSV Report

Built using:
-  Node.js + Express (backend)
-  HTML/CSS/JavaScript (frontend)
-  Python (for email validation logic)
-  CSV export with `openpyxl` and `pandas`

##  Key Features
-  Upload and process bulk emails via the browser  
-  Validates email syntax and structure (RFC-compliant)  
-  Verifies domain MX records to ensure it's real and can receive emails  
-  Flags common domain typos and suggests corrections  
-  One-click CSV download with full validation status  
-  Local dev server with `npm run dev`

**## Run the App**
- npm i
- npm run dev
- This will start the development server and open the UI in your browser (usually at http://localhost:8080).

**## CSV Format (Sample Input)**
email
john.doe@gmail.com
jane_doe@outlook
invalid_email@fake
user@gnail.com

## Screenshots

![Screenshot (1)](https://github.com/user-attachments/assets/4538dc74-7aab-4c4f-a8ba-78355db1dd4e)

 Output File
![Screenshot (2)](https://github.com/user-attachments/assets/3060c00b-fc63-444d-ba9d-4523e3520980)






