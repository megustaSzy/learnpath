import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // --- Seed Users for each role ---
  const password = await bcrypt.hash("password123", 10);

  const superAdmin = await db.user.upsert({
    where: { email: "superadmin@learnpath.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@learnpath.com",
      password,
      role: "SUPER_ADMIN",
      bio: "Platform super administrator",
    },
  });

  const admin = await db.user.upsert({
    where: { email: "admin@learnpath.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@learnpath.com",
      password,
      role: "ADMIN",
      bio: "Content manager and roadmap curator",
    },
  });

  const user = await db.user.upsert({
    where: { email: "user@learnpath.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@learnpath.com",
      password,
      role: "USER",
      bio: "Passionate developer learning new technologies",
      githubUrl: "https://github.com/johndoe",
      linkedinUrl: "https://linkedin.com/in/johndoe",
    },
  });

  console.log("✅ Users seeded:", { superAdmin: superAdmin.email, admin: admin.email, user: user.email });

  // --- Seed Categories ---
  const categories = [
    { name: "Backend Development", slug: "backend-development" },
    { name: "Frontend Development", slug: "frontend-development" },
    { name: "Full Stack Development", slug: "fullstack-development" },
    { name: "Mobile Development", slug: "mobile-development" },
    { name: "DevOps", slug: "devops" },
    { name: "Cyber Security", slug: "cyber-security" },
    { name: "Data Science", slug: "data-science" },
    { name: "Machine Learning", slug: "machine-learning" },
    { name: "Artificial Intelligence", slug: "artificial-intelligence" },
  ];

  for (const cat of categories) {
    await db.roadmapCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  // --- Seed Achievements ---
  const achievements = [
    { name: "Beginner", description: "Started your learning journey! Keep going!", badgeIcon: "🌱", requirementPercentage: 10 },
    { name: "Explorer", description: "You've explored 25% of a roadmap. Great progress!", badgeIcon: "🔍", requirementPercentage: 25 },
    { name: "Builder", description: "Halfway there! You're building solid knowledge.", badgeIcon: "🔨", requirementPercentage: 50 },
    { name: "Advanced", description: "75% complete! You're becoming an expert.", badgeIcon: "⚡", requirementPercentage: 75 },
    { name: "Master", description: "100% complete! You've mastered this roadmap!", badgeIcon: "🏆", requirementPercentage: 100 },
  ];

  for (const ach of achievements) {
    const existing = await db.achievement.findFirst({
      where: { name: ach.name },
    });
    if (!existing) {
      await db.achievement.create({ data: ach });
    }
  }
  console.log("✅ Achievements seeded");

  // --- Seed sample Roadmaps ---
  const categoriesDb = await db.roadmapCategory.findMany();
  const getCatId = (slug: string) => categoriesDb.find((c) => c.slug === slug)?.id;

  const roadmapsData = [
    {
      roadmap: { title: "Node.js Backend Developer", slug: "nodejs-backend-developer", description: "A comprehensive roadmap to become a proficient Node.js backend developer.", difficulty: "BEGINNER", estimatedHours: 120, categoryId: getCatId("backend-development"), createdBy: admin.id },
      topics: [
        { title: "JavaScript Fundamentals", description: "Learn the core concepts of JavaScript.", orderNumber: 1, estimatedHours: 15, resources: [{ title: "MDN JavaScript Guide", url: "https://developer.mozilla.org", resourceType: "DOCUMENTATION" as const }] },
        { title: "Node.js Basics", description: "Understand the Node.js runtime and npm.", orderNumber: 2, estimatedHours: 10, resources: [{ title: "Node.js Official Docs", url: "https://nodejs.org", resourceType: "DOCUMENTATION" as const }] },
        { title: "Express.js Framework", description: "Build RESTful APIs using Express.js.", orderNumber: 3, estimatedHours: 15, resources: [{ title: "Express.js Documentation", url: "https://expressjs.com/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Database Integration", description: "Integrate PostgreSQL with Node.js using Prisma.", orderNumber: 4, estimatedHours: 20, resources: [{ title: "Prisma ORM Documentation", url: "https://www.prisma.io/docs", resourceType: "DOCUMENTATION" as const }] },
        { title: "Authentication & Authorization", description: "Implement JWT and OAuth strategies.", orderNumber: 5, estimatedHours: 15, resources: [{ title: "JWT.io Introduction", url: "https://jwt.io/introduction", resourceType: "ARTICLE" as const }] },
      ]
    },
    {
      roadmap: { title: "React Frontend Developer", slug: "react-frontend-developer", description: "Master React.js from basics to advanced patterns.", difficulty: "INTERMEDIATE", estimatedHours: 100, categoryId: getCatId("frontend-development"), createdBy: admin.id },
      topics: [
        { title: "HTML & CSS Fundamentals", description: "Master semantic HTML and modern CSS.", orderNumber: 1, estimatedHours: 12, resources: [{ title: "MDN HTML Guide", url: "https://developer.mozilla.org", resourceType: "DOCUMENTATION" as const }] },
        { title: "React Basics", description: "Components, JSX, props, and state.", orderNumber: 2, estimatedHours: 18, resources: [{ title: "React Official Docs", url: "https://react.dev/", resourceType: "DOCUMENTATION" as const }] },
        { title: "State Management", description: "Context API, Zustand, Redux.", orderNumber: 3, estimatedHours: 12, resources: [{ title: "Zustand Documentation", url: "https://zustand-demo.pmnd.rs/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Next.js Framework", description: "Build full-stack apps with Next.js.", orderNumber: 4, estimatedHours: 15, resources: [{ title: "Next.js Docs", url: "https://nextjs.org/docs", resourceType: "DOCUMENTATION" as const }] },
      ]
    },
    {
      roadmap: { title: "Full Stack Next.js Engineer", slug: "fullstack-nextjs-engineer", description: "End-to-end web development with React, Next.js, Server Actions, and Postgres.", difficulty: "ADVANCED", estimatedHours: 180, categoryId: getCatId("fullstack-development"), createdBy: admin.id },
      topics: [
        { title: "Next.js App Router", description: "Deep dive into layout, pages, and Server Components.", orderNumber: 1, estimatedHours: 20, resources: [{ title: "Next.js Architecture", url: "https://nextjs.org", resourceType: "DOCUMENTATION" as const }] },
        { title: "Server Actions & Mutations", description: "Handling forms and database mutations directly from the server.", orderNumber: 2, estimatedHours: 15, resources: [{ title: "Server Actions Guide", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations", resourceType: "DOCUMENTATION" as const }] },
        { title: "Auth.js Integration", description: "Secure your app with NextAuth v5.", orderNumber: 3, estimatedHours: 20, resources: [{ title: "Auth.js Docs", url: "https://authjs.dev/", resourceType: "DOCUMENTATION" as const }] },
        { title: "PostgreSQL & Prisma", description: "Design schemas and optimize database relationships.", orderNumber: 4, estimatedHours: 25, resources: [{ title: "Prisma Relations", url: "https://www.prisma.io/docs/concepts/components/prisma-schema/relations", resourceType: "ARTICLE" as const }] },
        { title: "Deployment (Vercel & Docker)", description: "Shipping your app to production.", orderNumber: 5, estimatedHours: 10, resources: [{ title: "Vercel Deployment", url: "https://vercel.com/docs", resourceType: "DOCUMENTATION" as const }] },
      ]
    },
    {
      roadmap: { title: "Flutter Mobile Master", slug: "flutter-mobile-master", description: "Build cross-platform mobile apps for iOS and Android using Flutter.", difficulty: "INTERMEDIATE", estimatedHours: 150, categoryId: getCatId("mobile-development"), createdBy: admin.id },
      topics: [
        { title: "Dart Programming", description: "Learn Dart language fundamentals.", orderNumber: 1, estimatedHours: 15, resources: [{ title: "Dart Dev", url: "https://dart.dev/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Flutter Widgets", description: "Stateless vs Stateful, and UI building blocks.", orderNumber: 2, estimatedHours: 20, resources: [{ title: "Flutter Widget Catalog", url: "https://flutter.dev/docs/development/ui/widgets", resourceType: "DOCUMENTATION" as const }] },
        { title: "State Management (Provider & Riverpod)", description: "Managing app state effectively.", orderNumber: 3, estimatedHours: 25, resources: [{ title: "Riverpod Dev", url: "https://riverpod.dev/", resourceType: "DOCUMENTATION" as const }] },
        { title: "API Integration", description: "Fetching and parsing RESTful API data.", orderNumber: 4, estimatedHours: 15, resources: [{ title: "HTTP Package", url: "https://pub.dev/packages/http", resourceType: "DOCUMENTATION" as const }] },
      ]
    },
    {
      roadmap: { title: "DevOps & Cloud Engineer", slug: "devops-cloud-engineer", description: "Master CI/CD, containerization, and AWS infrastructure.", difficulty: "ADVANCED", estimatedHours: 200, categoryId: getCatId("devops"), createdBy: admin.id },
      topics: [
        { title: "Linux Basics & Shell Scripting", description: "Command line mastery.", orderNumber: 1, estimatedHours: 20, resources: [{ title: "Linux Journey", url: "https://linuxjourney.com/", resourceType: "COURSE" as const }] },
        { title: "Docker Containerization", description: "Building and running containers.", orderNumber: 2, estimatedHours: 25, resources: [{ title: "Docker 101", url: "https://www.docker.com/101-tutorial/", resourceType: "COURSE" as const }] },
        { title: "Kubernetes Orchestration", description: "Managing container clusters at scale.", orderNumber: 3, estimatedHours: 40, resources: [{ title: "K8s Docs", url: "https://kubernetes.io/docs/home/", resourceType: "DOCUMENTATION" as const }] },
        { title: "CI/CD with GitHub Actions", description: "Automated testing and deployment pipelines.", orderNumber: 4, estimatedHours: 20, resources: [{ title: "GH Actions", url: "https://github.com/features/actions", resourceType: "DOCUMENTATION" as const }] },
        { title: "Infrastructure as Code (Terraform)", description: "Provisioning cloud resources using Terraform.", orderNumber: 5, estimatedHours: 30, resources: [{ title: "Hashicorp Learn", url: "https://learn.hashicorp.com/terraform", resourceType: "COURSE" as const }] },
      ]
    },
    {
      roadmap: { title: "Cyber Security Analyst", slug: "cyber-security-analyst", description: "Understand network security, penetration testing, and ethical hacking.", difficulty: "ADVANCED", estimatedHours: 160, categoryId: getCatId("cyber-security"), createdBy: admin.id },
      topics: [
        { title: "Networking Fundamentals", description: "TCP/IP, OSI Model, Subnetting.", orderNumber: 1, estimatedHours: 20, resources: [{ title: "Network+", url: "https://www.comptia.org/certifications/network", resourceType: "COURSE" as const }] },
        { title: "Information Security Principles", description: "CIA Triad, Risk Management.", orderNumber: 2, estimatedHours: 15, resources: [{ title: "Security+", url: "https://www.comptia.org/certifications/security", resourceType: "COURSE" as const }] },
        { title: "Web Application Security", description: "OWASP Top 10 vulnerabilities.", orderNumber: 3, estimatedHours: 25, resources: [{ title: "OWASP", url: "https://owasp.org/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Penetration Testing", description: "Using Kali Linux, Metasploit, Nmap.", orderNumber: 4, estimatedHours: 40, resources: [{ title: "HackTheBox", url: "https://www.hackthebox.com/", resourceType: "COURSE" as const }] },
      ]
    },
    {
      roadmap: { title: "Python Data Scientist", slug: "python-data-scientist", description: "Learn Data Analysis, Visualization, and Machine Learning.", difficulty: "INTERMEDIATE", estimatedHours: 180, categoryId: getCatId("data-science"), createdBy: admin.id },
      topics: [
        { title: "Python for Data Science", description: "NumPy, Pandas, and SciPy.", orderNumber: 1, estimatedHours: 25, resources: [{ title: "Pandas Docs", url: "https://pandas.pydata.org/docs/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Data Visualization", description: "Matplotlib and Seaborn.", orderNumber: 2, estimatedHours: 20, resources: [{ title: "Seaborn Gallery", url: "https://seaborn.pydata.org/examples/index.html", resourceType: "DOCUMENTATION" as const }] },
        { title: "Statistics and Probability", description: "Math foundations for Data Science.", orderNumber: 3, estimatedHours: 30, resources: [{ title: "Khan Academy Stats", url: "https://www.khanacademy.org/math/statistics-probability", resourceType: "COURSE" as const }] },
        { title: "Machine Learning with Scikit-Learn", description: "Regression, Classification, Clustering.", orderNumber: 4, estimatedHours: 40, resources: [{ title: "Scikit-Learn Docs", url: "https://scikit-learn.org/stable/", resourceType: "DOCUMENTATION" as const }] },
      ]
    },
    {
      roadmap: { title: "Generative AI Engineer", slug: "generative-ai-engineer", description: "Build applications using LLMs, LangChain, and Vector Databases.", difficulty: "ADVANCED", estimatedHours: 140, categoryId: getCatId("artificial-intelligence"), createdBy: admin.id },
      topics: [
        { title: "Deep Learning Foundations", description: "Neural Networks, PyTorch basics.", orderNumber: 1, estimatedHours: 30, resources: [{ title: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Transformers and HuggingFace", description: "Understanding the Transformer architecture.", orderNumber: 2, estimatedHours: 25, resources: [{ title: "HuggingFace Course", url: "https://huggingface.co/course/", resourceType: "COURSE" as const }] },
        { title: "Prompt Engineering", description: "Techniques for interacting with LLMs effectively.", orderNumber: 3, estimatedHours: 15, resources: [{ title: "Prompting Guide", url: "https://www.promptingguide.ai/", resourceType: "DOCUMENTATION" as const }] },
        { title: "LangChain & Vector DBs", description: "Building RAG (Retrieval-Augmented Generation) pipelines.", orderNumber: 4, estimatedHours: 30, resources: [{ title: "LangChain Docs", url: "https://python.langchain.com/docs/get_started/introduction", resourceType: "DOCUMENTATION" as const }] },
      ]
    },
    // ---- NEW BEGINNER COURSES ----
    {
      roadmap: { title: "Complete Web Developer Zero to Hero", slug: "web-dev-zero-to-hero", description: "The perfect starting point for absolute beginners to learn web creation.", difficulty: "BEGINNER", estimatedHours: 60, categoryId: getCatId("frontend-development"), createdBy: admin.id },
      topics: [
        { title: "Introduction to the Internet", description: "How browsers, DNS, and HTTP work.", orderNumber: 1, estimatedHours: 5, resources: [{ title: "How the Web Works", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started/How_the_Web_works", resourceType: "ARTICLE" as const }] },
        { title: "HTML5 Basics", description: "Structuring content on the web.", orderNumber: 2, estimatedHours: 10, resources: [{ title: "HTML Crash Course", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", resourceType: "YOUTUBE" as const }] },
        { title: "CSS3 Styling", description: "Colors, typography, Flexbox, and Grid.", orderNumber: 3, estimatedHours: 20, resources: [{ title: "CSS Tricks Almanac", url: "https://css-tricks.com/almanac/", resourceType: "DOCUMENTATION" as const }] },
        { title: "JavaScript First Steps", description: "Variables, loops, and DOM manipulation.", orderNumber: 4, estimatedHours: 25, resources: [{ title: "JS DOM Tutorial", url: "https://javascript.info/document", resourceType: "ARTICLE" as const }] },
      ]
    },
    {
      roadmap: { title: "Python Programming for Beginners", slug: "python-for-beginners", description: "Learn the easiest and most versatile programming language.", difficulty: "BEGINNER", estimatedHours: 40, categoryId: getCatId("backend-development"), createdBy: admin.id },
      topics: [
        { title: "Python Syntax & Variables", description: "Print, variables, and data types.", orderNumber: 1, estimatedHours: 8, resources: [{ title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Control Flow", description: "If/Else statements and For/While loops.", orderNumber: 2, estimatedHours: 10, resources: [{ title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/", resourceType: "ARTICLE" as const }] },
        { title: "Functions & Modules", description: "Writing reusable code blocks.", orderNumber: 3, estimatedHours: 12, resources: [{ title: "Python Functions Guide", url: "https://realpython.com/defining-your-own-python-function/", resourceType: "ARTICLE" as const }] },
        { title: "Basic File Handling", description: "Reading and writing to text/CSV files.", orderNumber: 4, estimatedHours: 10, resources: [{ title: "Corey Schafer File Objects", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM", resourceType: "YOUTUBE" as const }] },
      ]
    },
    {
      roadmap: { title: "SQL & Databases 101", slug: "sql-databases-101", description: "Learn how to store, query, and manage data like a pro.", difficulty: "BEGINNER", estimatedHours: 35, categoryId: getCatId("data-science"), createdBy: admin.id },
      topics: [
        { title: "What is a Relational Database?", description: "Tables, rows, and primary keys.", orderNumber: 1, estimatedHours: 5, resources: [{ title: "Database Concepts", url: "https://www.khanacademy.org/computing/computer-programming/sql", resourceType: "COURSE" as const }] },
        { title: "Basic Queries (SELECT)", description: "Filtering, sorting, and limiting data.", orderNumber: 2, estimatedHours: 10, resources: [{ title: "SQLZoo Tutorial", url: "https://sqlzoo.net/", resourceType: "COURSE" as const }] },
        { title: "Aggregations", description: "GROUP BY, COUNT, SUM, and AVG.", orderNumber: 3, estimatedHours: 10, resources: [{ title: "W3Schools SQL Aggregate Functions", url: "https://www.w3schools.com/sql/sql_count_avg_sum.asp", resourceType: "DOCUMENTATION" as const }] },
        { title: "Joins & Relationships", description: "INNER, LEFT, and RIGHT JOINs.", orderNumber: 4, estimatedHours: 10, resources: [{ title: "SQL Joins Explained", url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", resourceType: "YOUTUBE" as const }] },
      ]
    },
    {
      roadmap: { title: "Git & GitHub Crash Course", slug: "git-github-crash-course", description: "The essential version control skills every developer needs.", difficulty: "BEGINNER", estimatedHours: 15, categoryId: getCatId("devops"), createdBy: admin.id },
      topics: [
        { title: "Version Control Concepts", description: "Why we use Git and how it saves files.", orderNumber: 1, estimatedHours: 3, resources: [{ title: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook/", resourceType: "DOCUMENTATION" as const }] },
        { title: "Basic Git Commands", description: "Init, add, commit, and status.", orderNumber: 2, estimatedHours: 5, resources: [{ title: "Git & GitHub for Beginners", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", resourceType: "YOUTUBE" as const }] },
        { title: "Branching & Merging", description: "Working safely in parallel features.", orderNumber: 3, estimatedHours: 5, resources: [{ title: "Learn Git Branching", url: "https://learngitbranching.js.org/", resourceType: "COURSE" as const }] },
        { title: "Collaborating on GitHub", description: "Pull requests, issues, and forks.", orderNumber: 4, estimatedHours: 2, resources: [{ title: "GitHub Flow", url: "https://docs.github.com/en/get-started/quickstart/github-flow", resourceType: "DOCUMENTATION" as const }] },
      ]
    },
    {
      roadmap: { title: "Java Basics & Object Oriented", slug: "java-basics-oop", description: "Learn core Java and the principles of Object-Oriented Programming.", difficulty: "BEGINNER", estimatedHours: 50, categoryId: getCatId("backend-development"), createdBy: admin.id },
      topics: [
        { title: "Java Setup & Syntax", description: "Installing JDK, basic syntax, compilation.", orderNumber: 1, estimatedHours: 10, resources: [{ title: "Java Programming Basics", url: "https://www.codecademy.com/learn/learn-java", resourceType: "COURSE" as const }] },
        { title: "Classes and Objects", description: "The foundation of OOP.", orderNumber: 2, estimatedHours: 15, resources: [{ title: "Java OOP Tutorial", url: "https://www.w3schools.com/java/java_oop.asp", resourceType: "DOCUMENTATION" as const }] },
        { title: "Inheritance & Polymorphism", description: "Reusing code effectively.", orderNumber: 3, estimatedHours: 15, resources: [{ title: "Java Inheritance Video", url: "https://www.youtube.com/watch?v=WPvGqX-TXP0", resourceType: "YOUTUBE" as const }] },
        { title: "Collections Framework", description: "Lists, Sets, and Maps.", orderNumber: 4, estimatedHours: 10, resources: [{ title: "Java Collections Guide", url: "https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html", resourceType: "DOCUMENTATION" as const }] },
      ]
    }
  ];

  for (const data of roadmapsData) {
    if (!data.roadmap.categoryId) continue; // Skip if category not found

    const roadmap = await db.roadmap.upsert({
      where: { slug: data.roadmap.slug },
      update: {},
      create: data.roadmap as any,
    });

    for (const t of data.topics) {
      const exists = await db.roadmapTopic.findFirst({ where: { roadmapId: roadmap.id, title: t.title } });
      if (!exists) {
        const topic = await db.roadmapTopic.create({
          data: { title: t.title, description: t.description, orderNumber: t.orderNumber, estimatedHours: t.estimatedHours, roadmapId: roadmap.id },
        });
        for (const r of t.resources) {
          await db.topicResource.create({ data: { ...r, topicId: topic.id } });
        }
      }
    }
  }
  
  console.log("✅ All Roadmaps and resources seeded successfully!");

  console.log("\n🎉 Seed completed!");
  console.log("\n📋 Login credentials:");
  console.log("  Super Admin: superadmin@learnpath.com / password123");
  console.log("  Admin:       admin@learnpath.com / password123");
  console.log("  User:        user@learnpath.com / password123");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); await pool.end(); });
