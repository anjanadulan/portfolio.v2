import { MotionConfig } from "framer-motion";
import { Briefcase, FileText, Home, User } from "lucide-react";

import { NavBar, type NavItem } from "@/components/ui/tubelight-navbar";

const items: NavItem[] = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/#about", icon: User },
  { name: "Projects", url: "/projects/", icon: Briefcase },
  { name: "Résumé", url: "/resume.pdf", icon: FileText },
];

interface PortfolioNavProps {
  initialPath?: string;
}

export default function PortfolioNav({ initialPath = "/" }: PortfolioNavProps) {
  const initialActive = initialPath.startsWith("/projects/") ? "Projects" : "Home";

  return (
    <MotionConfig reducedMotion="user">
      <NavBar items={items} className="tubelight-navigation" initialActive={initialActive} />
    </MotionConfig>
  );
}
