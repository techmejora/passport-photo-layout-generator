import { api } from "encore.dev/api";

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: "id" | "business" | "membership" | "student" | "employee" | "custom";
  preview: string;
  features: string[];
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  name: string;
  type: "text" | "image" | "color" | "select" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
}

export interface CardSize {
  id: string;
  name: string;
  width: number; // in mm
  height: number; // in mm
  description: string;
  common: boolean;
}

export interface GetTemplatesResponse {
  templates: CardTemplate[];
  cardSizes: CardSize[];
  colorSchemes: ColorScheme[];
}

export interface ColorScheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  preview: string;
}

// Gets available card templates and settings
export const getTemplates = api<void, GetTemplatesResponse>(
  { expose: true, method: "GET", path: "/card/templates" },
  async () => {
    return {
      templates: [
        {
          id: "modern-id",
          name: "Modern ID Card",
          description: "Clean, professional design with photo and company branding",
          category: "id",
          preview: "/templates/modern-id.png",
          features: ["Photo placement", "Company logo", "Accent bar", "Contact info"],
          fields: [
            { id: "name", name: "Full Name", type: "text", required: true, placeholder: "John Doe", maxLength: 50 },
            { id: "title", name: "Job Title", type: "text", required: false, placeholder: "Software Engineer", maxLength: 40 },
            { id: "organization", name: "Organization", type: "text", required: true, placeholder: "Company Name", maxLength: 40 },
            { id: "id", name: "Employee ID", type: "text", required: false, placeholder: "EMP001", maxLength: 20 },
            { id: "department", name: "Department", type: "text", required: false, placeholder: "Engineering", maxLength: 30 },
            { id: "email", name: "Email", type: "text", required: false, placeholder: "john@company.com", maxLength: 50 },
            { id: "phone", name: "Phone", type: "text", required: false, placeholder: "+1 234 567 8900", maxLength: 20 },
            { id: "photo", name: "Photo", type: "image", required: false },
            { id: "logo", name: "Company Logo", type: "image", required: false }
          ]
        },
        {
          id: "classic-business",
          name: "Classic Business Card",
          description: "Traditional business card layout with contact information",
          category: "business",
          preview: "/templates/classic-business.png",
          features: ["Contact details", "Social media", "QR code", "Professional layout"],
          fields: [
            { id: "name", name: "Full Name", type: "text", required: true, placeholder: "Jane Smith", maxLength: 50 },
            { id: "title", name: "Job Title", type: "text", required: true, placeholder: "Marketing Director", maxLength: 40 },
            { id: "organization", name: "Company", type: "text", required: true, placeholder: "ABC Corp", maxLength: 40 },
            { id: "email", name: "Email", type: "text", required: true, placeholder: "jane@abc.com", maxLength: 50 },
            { id: "phone", name: "Phone", type: "text", required: true, placeholder: "+1 234 567 8900", maxLength: 20 },
            { id: "address", name: "Address", type: "textarea", required: false, placeholder: "123 Business St, City, State 12345", maxLength: 100 },
            { id: "logo", name: "Company Logo", type: "image", required: false }
          ]
        },
        {
          id: "student-id",
          name: "Student ID Card",
          description: "Academic institution ID with student information",
          category: "student",
          preview: "/templates/student-id.png",
          features: ["Student photo", "Institution branding", "Academic year", "Emergency contact"],
          fields: [
            { id: "name", name: "Student Name", type: "text", required: true, placeholder: "Alex Johnson", maxLength: 50 },
            { id: "id", name: "Student ID", type: "text", required: true, placeholder: "STU2024001", maxLength: 20 },
            { id: "organization", name: "Institution", type: "text", required: true, placeholder: "University Name", maxLength: 40 },
            { id: "department", name: "Program/Major", type: "text", required: false, placeholder: "Computer Science", maxLength: 40 },
            { id: "title", name: "Academic Year", type: "select", required: true, options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"] },
            { id: "email", name: "Email", type: "text", required: false, placeholder: "alex@university.edu", maxLength: 50 },
            { id: "photo", name: "Student Photo", type: "image", required: true },
            { id: "logo", name: "Institution Logo", type: "image", required: false }
          ]
        },
        {
          id: "membership-card",
          name: "Membership Card",
          description: "Club or organization membership card with benefits",
          category: "membership",
          preview: "/templates/membership.png",
          features: ["Member benefits", "Expiry date", "Membership level", "Contact info"],
          fields: [
            { id: "name", name: "Member Name", type: "text", required: true, placeholder: "Chris Wilson", maxLength: 50 },
            { id: "id", name: "Member ID", type: "text", required: true, placeholder: "MEM2024001", maxLength: 20 },
            { id: "organization", name: "Organization", type: "text", required: true, placeholder: "Fitness Club", maxLength: 40 },
            { id: "title", name: "Membership Level", type: "select", required: true, options: ["Basic", "Premium", "VIP", "Platinum"] },
            { id: "department", name: "Valid Until", type: "text", required: true, placeholder: "Dec 2024", maxLength: 20 },
            { id: "email", name: "Email", type: "text", required: false, placeholder: "chris@email.com", maxLength: 50 },
            { id: "photo", name: "Member Photo", type: "image", required: false },
            { id: "logo", name: "Organization Logo", type: "image", required: false }
          ]
        },
        {
          id: "minimal-employee",
          name: "Minimal Employee Badge",
          description: "Simple, clean employee identification badge",
          category: "employee",
          preview: "/templates/minimal-employee.png",
          features: ["Minimal design", "Essential info only", "Easy to read", "Professional"],
          fields: [
            { id: "name", name: "Employee Name", type: "text", required: true, placeholder: "Sam Davis", maxLength: 50 },
            { id: "title", name: "Position", type: "text", required: true, placeholder: "Project Manager", maxLength: 40 },
            { id: "organization", name: "Company", type: "text", required: true, placeholder: "Tech Solutions", maxLength: 40 },
            { id: "id", name: "Badge Number", type: "text", required: false, placeholder: "B001", maxLength: 10 },
            { id: "photo", name: "Employee Photo", type: "image", required: true },
            { id: "logo", name: "Company Logo", type: "image", required: false }
          ]
        },
        {
          id: "custom-blank",
          name: "Custom Blank Card",
          description: "Start with a blank canvas and create your own design",
          category: "custom",
          preview: "/templates/custom-blank.png",
          features: ["Full customization", "All field types", "Flexible layout", "Your design"],
          fields: [
            { id: "name", name: "Primary Text", type: "text", required: false, placeholder: "Main heading", maxLength: 50 },
            { id: "title", name: "Secondary Text", type: "text", required: false, placeholder: "Subtitle", maxLength: 40 },
            { id: "organization", name: "Organization", type: "text", required: false, placeholder: "Organization name", maxLength: 40 },
            { id: "id", name: "ID/Number", type: "text", required: false, placeholder: "ID or reference", maxLength: 20 },
            { id: "department", name: "Additional Info", type: "text", required: false, placeholder: "Extra information", maxLength: 40 },
            { id: "email", name: "Contact Email", type: "text", required: false, placeholder: "contact@email.com", maxLength: 50 },
            { id: "phone", name: "Phone Number", type: "text", required: false, placeholder: "Phone number", maxLength: 20 },
            { id: "address", name: "Address", type: "textarea", required: false, placeholder: "Full address", maxLength: 100 },
            { id: "photo", name: "Photo/Image", type: "image", required: false },
            { id: "logo", name: "Logo/Brand", type: "image", required: false }
          ]
        }
      ],
      cardSizes: [
        {
          id: "cr80",
          name: "CR80 (Standard Credit Card)",
          width: 85.6,
          height: 53.98,
          description: "Most common card size - same as credit cards",
          common: true
        },
        {
          id: "cr79",
          name: "CR79 (Slightly Smaller)",
          width: 79.5,
          height: 50.0,
          description: "Slightly smaller than standard, fits in tight spaces",
          common: false
        },
        {
          id: "business",
          name: "Business Card (US)",
          width: 89,
          height: 51,
          description: "Standard US business card size",
          common: true
        },
        {
          id: "business-eu",
          name: "Business Card (EU)",
          width: 85,
          height: 55,
          description: "European business card standard",
          common: false
        },
        {
          id: "custom",
          name: "Custom Size",
          width: 85.6,
          height: 53.98,
          description: "Define your own dimensions",
          common: false
        }
      ],
      colorSchemes: [
        {
          id: "corporate-blue",
          name: "Corporate Blue",
          backgroundColor: "#1e40af",
          textColor: "#ffffff",
          accentColor: "#3b82f6",
          preview: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"
        },
        {
          id: "professional-gray",
          name: "Professional Gray",
          backgroundColor: "#374151",
          textColor: "#ffffff",
          accentColor: "#6b7280",
          preview: "linear-gradient(135deg, #374151 0%, #6b7280 100%)"
        },
        {
          id: "modern-green",
          name: "Modern Green",
          backgroundColor: "#059669",
          textColor: "#ffffff",
          accentColor: "#10b981",
          preview: "linear-gradient(135deg, #059669 0%, #10b981 100%)"
        },
        {
          id: "elegant-purple",
          name: "Elegant Purple",
          backgroundColor: "#7c3aed",
          textColor: "#ffffff",
          accentColor: "#a855f7",
          preview: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
        },
        {
          id: "warm-orange",
          name: "Warm Orange",
          backgroundColor: "#ea580c",
          textColor: "#ffffff",
          accentColor: "#fb923c",
          preview: "linear-gradient(135deg, #ea580c 0%, #fb923c 100%)"
        },
        {
          id: "classic-black",
          name: "Classic Black",
          backgroundColor: "#000000",
          textColor: "#ffffff",
          accentColor: "#404040",
          preview: "linear-gradient(135deg, #000000 0%, #404040 100%)"
        },
        {
          id: "clean-white",
          name: "Clean White",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          accentColor: "#3b82f6",
          preview: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)"
        },
        {
          id: "tech-cyan",
          name: "Tech Cyan",
          backgroundColor: "#0891b2",
          textColor: "#ffffff",
          accentColor: "#06b6d4",
          preview: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
        }
      ]
    };
  }
);
