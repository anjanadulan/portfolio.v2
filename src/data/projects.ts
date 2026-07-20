export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  contribution: string;
  context: string;
  stack: string[];
  github: string;
  demo?: string;
  image?: string;
  imageAlt?: string;
  details: string[];
};

export const projects: Project[] = [
  {
    slug: "booknest",
    title: "BookNest",
    category: "Full-stack commerce",
    summary: "A full-stack e-bookshop built with React, Tailwind, shadcn/ui, Spring Boot, and MySQL across five independent services.",
    contribution: "Designed and implemented the microservices layer for a group project.",
    context: "Group project",
    stack: ["Spring Boot", "React", "TypeScript", "MySQL", "Tailwind CSS", "shadcn/ui"],
    github: "https://github.com/anjanadulan/BookNest",
    image: "/images/booknest.png",
    imageAlt: "BookNest e-bookshop website preview",
    details: [
      "Five independent services cover books, carts, orders, payments, and users, each with its own database.",
      "The application supports catalog browsing, customer accounts, carts, checkout, stock handling, order history, and administrative workflows.",
      "Each service owns its database, keeping responsibilities separated while the frontend coordinates the customer journey."
    ]
  },
  {
    slug: "distributor-management-system",
    title: "Distributor MS",
    category: "Operations software",
    summary: "A full-stack distribution system with role-based dashboards, inventory, orders, deliveries, payments, analytics, and PDF exports.",
    contribution: "Built the database and backend, and contributed to selected frontend interfaces.",
    context: "Group project",
    stack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Electron", "Lit"],
    github: "https://github.com/anjanadulan/distributor-ms",
    demo: "https://distributor-ms.vercel.app",
    details: [
      "Role-based dashboards support management, operations, logistics, and supplier workflows.",
      "The REST API uses session-based authentication with Prisma managing the PostgreSQL data model.",
      "The frontend uses Vanilla JS, Lit, Tailwind CSS, and Webpack, with an optional Electron desktop shell."
    ]
  },
  {
    slug: "smart-aqua-manage-bot",
    title: "Smart Aqua Manage Bot",
    category: "IoT and automation",
    summary: "A standalone aquarium ecosystem with local microcontrollers, physical sensors, camera streaming, WebSockets, and a real-time 3D dashboard.",
    contribution: "Led most of the implementation across hardware, control logic, and the web experience.",
    context: "Group project",
    stack: ["ESP32", "ESP32-CAM", "WebSockets", "Three.js", "Vanilla JS"],
    github: "https://github.com/anjanadulan/Smart-Aqua-Manage-Bot",
    image: "/images/smart-aqua-concept.png",
    imageAlt: "Smart Aqua repository concept showing the automated aquarium ecosystem and local controller loop",
    details: [
      "The local hardware loop runs automation without external cloud dependencies and includes fail-safe controls.",
      "The system combines feeding, water controls, a cleaning gantry, water-level sensing, pH monitoring, and camera streaming.",
      "A responsive 3D dashboard presents telemetry and provides control over the local network."
    ]
  },
  {
    slug: "agrochain",
    title: "AgroChain",
    category: "Java desktop application",
    summary: "A Java desktop application for field management, crop-health monitoring, harvest tracking, and farmer-to-buyer supply-chain workflows.",
    contribution: "Independently designed and developed the complete application and database.",
    context: "Individual project",
    stack: ["Java 24", "Swing", "MySQL 8", "JDBC"],
    github: "https://github.com/anjanadulan/AgroChain",
    image: "/images/agrochain.jpg",
    imageAlt: "AgroChain agricultural management application hero image",
    details: [
      "Role-based access separates administrator, field officer, and buyer responsibilities.",
      "The application covers field registration, crop-health records, harvest tracking, and buyer requests.",
      "Object-oriented modules and a relational data model keep the desktop workflow maintainable."
    ]
  }
];

export const experiments = [
  {
    title: "Water Quality Checker",
    summary: "An ESP32 TDS sensor that categorizes water quality and streams live readings to a Firebase web dashboard.",
    stack: "ESP32 / TDS sensor / Firebase",
    href: "https://github.com/anjanadulan/Water-Quality-Checker",
    demo: "https://testdb-bbc12.web.app",
    image: "/images/water-quality.jpg",
    imageAlt: "ESP32 water quality sensor hardware setup"
  },
  {
    title: "Orbital",
    summary: "An IP and GPS map tracker using MapLibre, DNS-over-HTTPS, public geolocation APIs, and satellite imagery.",
    stack: "JavaScript / MapLibre GL",
    href: "https://github.com/anjanadulan/iphunt-satellite-map",
    demo: "https://ipmap-kappa.vercel.app"
  },
  {
    title: "SimpleCalc",
    summary: "A responsive Java Servlet calculator with server-side evaluation and a focused interface.",
    stack: "Java / Servlets",
    href: "https://github.com/anjanadulan/simpleCalc-jsp-servlets-"
  }
];
