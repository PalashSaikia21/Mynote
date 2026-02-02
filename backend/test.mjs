import "dotenv/config";

console.log("--- Environment Variable Diagnostic ---");
console.log("Current Directory:", process.cwd());
console.log("GMAIL_USER exists?:", !!process.env.GMAIL_USER);
console.log("GMAIL_USER value:", process.env.GMAIL_USER);
console.log(
  "GMAIL_PASS Length:",
  process.env.GMAIL_PASS ? process.env.GMAIL_PASS.length : "UNDEFINED"
);
console.log("---------------------------------------");
