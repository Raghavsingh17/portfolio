
import {
  Sparkles,
  Code2,
  Palette,
  Server,
  Database,
  Zap,
  Brain,
  Cpu,
  Box,
  Cloud,
  Gauge,
  Layers,
} from "lucide-react";
import {
  ReactLogo,
  ReactBitsLogo,
  NextjsLogo,
  TypeScriptLogo,
  JavaScriptLogo,
  TailwindLogo,
  NodejsLogo,
  ExpressjsLogo,
  AGGridLogo,
  GraphQLLogo,
  ApolloClientLogo,
  Html5Logo,
  Css3Logo,
  Html5Css3Logo,
  RestApiLogo,
  SassLogo,
  FigmaLogo,
  ReduxLogo,
  StorybookLogo,
  MUILogo,
  FramerMotionLogo,
  MongoDBLogo,
  SQLiteLogo,
  PostmanLogo,
  InsomniaLogo,
  JestLogo,
  VitestLogo,
  ReactTestingLibraryLogo,
  GitLogo,
  GitHubLogo,
  JiraLogo,
} from "@/src/components/ui/TechIcons";

// Modal Categories for Full-Page Exploration
export const MODAL_CATEGORIES = [
  "Languages",
  "Frameworks & Libraries",
  "Backend & Database",
  "API & Data",
  "Testing & Animation",
  "Dev Tools",
];

// Helper to get colorful animated border glow presets for skill icons
export function getSkillIconGlow(_category: string, _idx: number) {
  return "theme";
}

// Helper to render official brand SVGs or fallback icons
export function renderTechIcon(iconName: string) {
  switch (iconName) {
    case "ReactLogo":
      return <ReactLogo className="h-6 w-6" />;
    case "ReactBitsLogo":
      return <ReactBitsLogo className="h-6 w-6" />;
    case "NextjsLogo":
      return <NextjsLogo className="h-6 w-6 text-white light:text-slate-900" />;
    case "TypeScriptLogo":
      return <TypeScriptLogo className="h-7 w-7 text-blue-400" />;
    case "JavaScriptLogo":
      return <JavaScriptLogo className="h-7 w-7" />;
    case "TailwindLogo":
      return <TailwindLogo className="h-6 w-6" />;
    case "NodejsLogo":
      return <NodejsLogo className="h-6 w-6" />;
    case "ExpressjsLogo":
      return <ExpressjsLogo className="h-6 w-6 text-slate-200" />;
    case "AGGridLogo":
      return <AGGridLogo className="h-6 w-6" />;
    case "GraphQLLogo":
      return <GraphQLLogo className="h-6 w-6" />;
    case "ApolloClientLogo":
      return <ApolloClientLogo className="h-6 w-6" />;
    case "Html5Logo":
      return <Html5Logo className="h-7 w-7" />;
    case "Css3Logo":
      return <Css3Logo className="h-7 w-7" />;
    case "Html5Css3Logo":
      return <Html5Css3Logo className="h-7 w-7" />;
    case "RestApiLogo":
      return <RestApiLogo className="h-6 w-6" />;
    case "SassLogo":
      return <SassLogo className="h-6 w-6" />;
    case "FigmaLogo":
      return <FigmaLogo className="h-6 w-6" />;
    case "ReduxLogo":
      return <ReduxLogo className="h-6 w-6" />;
    case "StorybookLogo":
      return <StorybookLogo className="h-6 w-6" />;
    case "MUILogo":
      return <MUILogo className="h-6 w-6" />;
    case "FramerMotionLogo":
      return <FramerMotionLogo className="h-6 w-6" />;
    case "MongoDBLogo":
      return <MongoDBLogo className="h-6 w-6" />;
    case "SQLiteLogo":
      return <SQLiteLogo className="h-6 w-6" />;
    case "PostmanLogo":
      return <PostmanLogo className="h-6 w-6" />;
    case "InsomniaLogo":
      return <InsomniaLogo className="h-6 w-6" />;
    case "JestLogo":
      return <JestLogo className="h-6 w-6" />;
    case "VitestLogo":
      return <VitestLogo className="h-6 w-6" />;
    case "ReactTestingLibraryLogo":
      return <ReactTestingLibraryLogo className="h-6 w-6" />;
    case "GitLogo":
      return <GitLogo className="h-6 w-6" />;
    case "GitHubLogo":
      return <GitHubLogo className="h-6 w-6 text-white light:text-slate-900" />;
    case "JiraLogo":
      return <JiraLogo className="h-6 w-6" />;
    case "Brain":
      return <Brain className="h-6 w-6 text-purple-400" />;
    case "Cpu":
      return <Cpu className="h-6 w-6 text-indigo-400" />;
    case "Database":
      return <Database className="h-6 w-6 text-emerald-400" />;
    case "Sparkles":
      return <Sparkles className="h-6 w-6 text-amber-400" />;
    case "Code2":
      return <Code2 className="h-6 w-6 text-blue-400" />;
    case "Palette":
      return <Palette className="h-6 w-6 text-pink-400" />;
    case "Layers":
      return <Layers className="h-6 w-6 text-cyan-400" />;
    case "Server":
      return <Server className="h-6 w-6 text-emerald-400" />;
    case "Zap":
      return <Zap className="h-6 w-6 text-amber-400" />;
    case "Box":
      return <Box className="h-6 w-6 text-blue-400" />;
    case "Cloud":
      return <Cloud className="h-6 w-6 text-sky-400" />;
    case "Gauge":
      return <Gauge className="h-6 w-6 text-rose-400" />;
    default:
      return <Code2 className="h-6 w-6 text-blue-400" />;
  }
}
