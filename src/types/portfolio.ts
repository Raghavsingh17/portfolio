export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  image: string;
  category: "Full Stack" | "AI & ML" | "Web App" | "Developer Tools";
  tags: string[];
  metrics?: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  highlights?: string[];
}

export interface Skill {
  name: string;
  category: string;
  level: number; // 0-100
  iconName: string;
  description: string;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  status?: "Current" | "Completed";
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  highlights: string;
}


