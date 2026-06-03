<div align="center">
  <img src="public/logo-learn.png" alt="LearnPath Logo" width="120" height="120" />
  <h1>🚀 LearnPath</h1>
  <p><strong>Empower Your Developer Journey with Structured Roadmaps & Goals</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

<br />

## 📖 What is LearnPath?

**LearnPath** is a premium, open-source learning platform designed specifically for developers. It eliminates the "tutorial hell" by providing structured, curated learning **Roadmaps**, allowing users to track their progress, set weekly goals, and earn achievements as they master new technologies.

Whether you're starting from zero or a senior engineer looking to learn generative AI, LearnPath guides you every step of the way.

---

## ✨ Key Features

### 🧑‍💻 For Learners (Users)
- **Interactive Roadmaps:** Discover curated learning paths for various roles (Frontend, Backend, DevOps, Data Science, AI, etc).
- **Progress Tracking:** Mark topics as completed and visually track your mastery percentage.
- **Weekly Goals:** Set and manage personal deadlines to maintain momentum.
- **Achievements & Badges:** Earn milestones (e.g., "Explorer", "Master") based on your learning activity.
- **Activity Logs:** View your recent learning history.

### 🛡️ For Curators (Admins)
- **Roadmap Management:** Create, edit, and categorize roadmaps.
- **Topic & Resource Manager:** Add detailed learning materials (YouTube, Articles, Documentation, Courses) to each topic.

### 👑 For Owners (Super Admins)
- **Role-Based Access Control (RBAC):** Manage all users, promote members to Admins, or ban disruptive users.
- **System Activity:** Complete oversight over platform data and system logs.

---

## 🛠️ Tech Stack

LearnPath is built using cutting-edge, industry-standard technologies:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Glassmorphism UI
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma v7](https://www.prisma.io/)
- **Authentication:** [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **Validation:** Zod & React Hook Form

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database (Local or Cloud like Neon/Supabase)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/learnpath.git
cd learnpath
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example` (if available), or set the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/learnpath"
NEXTAUTH_SECRET="your_super_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database & Seed Data
Push the Prisma schema to your database and run the seeder to populate dummy data (Users, Categories, and beginner to advanced Roadmaps).
```bash
npx prisma db push
# or
npx prisma migrate dev

# Seed the database
npm run seed
```
> **Note:** The seeder automatically creates three accounts for testing:
> - `superadmin@learnpath.com` (password123)
> - `admin@learnpath.com` (password123)
> - `user@learnpath.com` (password123)

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📂 Project Structure

```text
learnpath/
├── prisma/               # Database schema and seeder
├── public/               # Static assets (logo, images)
├── src/
│   ├── app/              # Next.js App Router pages (Dashboard, Login, API)
│   ├── components/       # Reusable UI components (shadcn)
│   ├── lib/              # Utility functions, Prisma client, Server Actions
│   └── generated/        # Generated Prisma Client
├── package.json
└── tailwind.config.ts
```

---

## 🎨 UI/UX Highlights
LearnPath prioritizes a **Premium Glassmorphism Aesthetic**. Features include:
- Blur backdrops and translucent cards (`bg-black/50`, `backdrop-blur-md`).
- Split-screen responsive authentication layouts.
- Interactive hover effects and modern micro-animations.
- Beautiful custom SVG typography using `Plus Jakarta Sans`.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Built with ❤️ by the LearnPath Team.</p>
</div>
