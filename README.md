# Anjana Wijerathna - Portfolio

Personal portfolio for Anjana Wijerathna, a full-stack developer and BSc (Hons) Computer Science with Software Engineering undergraduate at the National Institute of Business Management in Colombo, Sri Lanka.

The portfolio presents selected software, hardware, and entrepreneurial work while Anjana looks for a software engineering internship.

## Portfolio focus

- Full-stack web applications and service-oriented systems
- Java desktop applications and relational data models
- IoT prototypes, local controller loops, and real-time dashboards
- Practical project write-ups that explain the problem, contribution, and technology choices
- Wall-E Prints, an independent print and poster business currently being developed

## Featured projects

### BookNest

Full-stack e-bookshop built with React, Tailwind CSS, shadcn/ui, Spring Boot, and MySQL. The platform is split into five independent services for books, carts, orders, payments, and users, with isolated databases.

- Role: designed and implemented the microservices layer
- Type: group project
- Repository: [anjanadulan/BookNest](https://github.com/anjanadulan/BookNest)

### Distributor Management System

Full-stack distribution software for role-based dashboards, inventory, orders, deliveries, payments, analytics, and PDF exports. The frontend uses Vanilla JavaScript, Lit, Tailwind CSS, and Webpack, with an optional Electron desktop shell.

- Role: database, backend, and selected frontend interfaces
- Type: group project
- Repository: [anjanadulan/distributor-ms](https://github.com/anjanadulan/distributor-ms)
- Live demo: [distributor-ms.vercel.app](https://distributor-ms.vercel.app)

### Smart Aqua Manage Bot

Standalone aquarium automation ecosystem using ESP32 hardware, an ESP32-CAM, physical sensors, WebSockets, camera streaming, and a real-time 3D dashboard. The core loop is designed to run locally without cloud dependencies.

- Role: led most of the hardware, control logic, and web implementation
- Type: group project
- Repository: [anjanadulan/Smart-Aqua-Manage-Bot](https://github.com/anjanadulan/Smart-Aqua-Manage-Bot)

### AgroChain

Java desktop application for agricultural field management, crop-health monitoring, harvest tracking, and farmer-to-buyer supply-chain workflows.

- Role: independently designed and developed the application and database
- Type: individual project
- Repository: [anjanadulan/AgroChain](https://github.com/anjanadulan/AgroChain)

## Experiments

- **Water Quality Checker** - ESP32 TDS sensor with water-quality categorization and a Firebase dashboard. [Source](https://github.com/anjanadulan/Water-Quality-Checker) | [Live dashboard](https://testdb-bbc12.web.app)
- **Orbital** - IP and GPS satellite map tracker using MapLibre, OpenFreeMap, DNS-over-HTTPS, and public geolocation services. [Source](https://github.com/anjanadulan/iphunt-satellite-map) | [Live demo](https://ipmap-kappa.vercel.app)
- **SimpleCalc** - Java Servlet and JSP calculator running on Tomcat with a responsive dark glass interface. [Source](https://github.com/anjanadulan/simpleCalc-jsp-servlets-)

## Technology

### Frontend

Astro, React, TypeScript, JavaScript, HTML, native CSS, Tailwind CSS, Lit, Three.js, MapLibre GL, and shadcn/ui.

### Backend and data

Java, Spring Boot, Node.js, Express, REST APIs, WebSockets, MySQL, PostgreSQL, Prisma, JDBC, Firebase, and session-based authentication.

### Hardware and systems

ESP32, ESP32-CAM, NodeMCU, Arduino, TDS sensors, local Wi-Fi control loops, camera streaming, and embedded automation.

## Design system

The portfolio uses a dark editorial canvas inspired by premium product and architecture sites:

- Instrument Sans for oversized display typography
- Instrument Serif and DM Mono for supporting hierarchy and technical labels
- Orbit lines, grain, and a body-only animated ambient background
- Glass navigation, theme control, and floating wordmark
- Image-led project entries with asymmetric layouts
- Center-out route wipe transitions that wait for the incoming page to settle
- Responsive layouts for desktop, tablet, and mobile
- Reduced-motion support for users who prefer less animation

## Project structure

```text
src/
  components/
    ui/                 Shared navigation UI
    Footer.astro       Global footer
    Nav.astro          Floating wordmark, navigation, and theme switch
    ProjectRow.astro   Image-led project archive entry
  data/
    projects.ts        Featured projects and experiments
  layouts/
    Layout.astro       Global shell, theme state, and route transitions
  pages/
    index.astro        Portfolio homepage
    projects/index.astro
    projects/[slug].astro
    404.astro
  styles/
    global.css         Global design system and responsive styling
public/
  images/              Portfolio and repository preview images
  resume.pdf           Public résumé
```

## Content and assets

Featured project metadata is maintained in `src/data/projects.ts`. Repository preview images are stored locally in `public/images` so project pages remain reliable and fast. The project links point to the corresponding public GitHub repositories and live demos where available.

## Links

- Portfolio: [anjanaw.vercel.app](https://anjanaw.vercel.app)
- GitHub: [github.com/anjanadulan](https://github.com/anjanadulan)
- LinkedIn: [linkedin.com/in/anjanawijerathna](https://www.linkedin.com/in/anjanawijerathna/)
- Email: [Dulannimsara453@gmail.com](mailto:Dulannimsara453@gmail.com)

## License

This repository contains a personal portfolio and project presentation. Project ownership and licenses remain with their respective repositories and contributors.
