"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ===================== HELPER =====================
async function getSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function handleStreak(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { lastActiveDate: true, streakCount: true } });
  if (!user) return;
  
  const now = new Date();
  const lastActive = user.lastActiveDate;
  
  if (!lastActive) {
    await db.user.update({ where: { id: userId }, data: { streakCount: 1, lastActiveDate: now } });
    return;
  }
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    await db.user.update({ where: { id: userId }, data: { streakCount: user.streakCount + 1, lastActiveDate: now } });
  } else if (diffDays > 1) {
    await db.user.update({ where: { id: userId }, data: { streakCount: 1, lastActiveDate: now } });
  } else if (diffDays === 0) {
    await db.user.update({ where: { id: userId }, data: { lastActiveDate: now } });
  }
}

// ===================== CATEGORY ACTIONS =====================
export async function getCategories() {
  return db.roadmapCategory.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(data: { name: string }) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const slug = slugify(data.name);
  const category = await db.roadmapCategory.create({ data: { name: data.name, slug } });
  revalidatePath("/dashboard/categories");
  return category;
}

export async function updateCategory(id: string, data: { name: string }) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const slug = slugify(data.name);
  const category = await db.roadmapCategory.update({ where: { id }, data: { name: data.name, slug } });
  revalidatePath("/dashboard/categories");
  return category;
}

export async function deleteCategory(id: string) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  await db.roadmapCategory.delete({ where: { id } });
  revalidatePath("/dashboard/categories");
}

// ===================== ROADMAP ACTIONS =====================
export async function getRoadmaps() {
  return db.roadmap.findMany({
    include: {
      category: true,
      creator: { select: { name: true } },
      _count: { select: { topics: true, userRoadmaps: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRoadmapBySlug(slug: string) {
  return db.roadmap.findUnique({
    where: { slug },
    include: {
      category: true,
      creator: { select: { name: true } },
      topics: {
        orderBy: { orderNumber: "asc" },
        include: { resources: true, _count: { select: { userProgress: true } } },
      },
      _count: { select: { userRoadmaps: true } },
    },
  });
}

export async function createRoadmap(data: {
  title: string;
  description?: string;
  categoryId: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedHours?: number;
}) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const slug = slugify(data.title);
  const roadmap = await db.roadmap.create({
    data: { ...data, slug, createdBy: session.user.id },
  });
  revalidatePath("/dashboard/roadmaps");
  return roadmap;
}

export async function updateRoadmap(id: string, data: {
  title?: string;
  description?: string;
  categoryId?: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedHours?: number;
}) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const updateData: any = { ...data };
  if (data.title) updateData.slug = slugify(data.title);
  const roadmap = await db.roadmap.update({ where: { id }, data: updateData });
  revalidatePath("/dashboard/roadmaps");
  return roadmap;
}

export async function deleteRoadmap(id: string) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  await db.roadmap.delete({ where: { id } });
  revalidatePath("/dashboard/roadmaps");
}

// ===================== TOPIC ACTIONS =====================
export async function createTopic(data: {
  roadmapId: string;
  title: string;
  description?: string;
  orderNumber: number;
  estimatedHours?: number;
}) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const topic = await db.roadmapTopic.create({ data });
  revalidatePath("/dashboard/roadmaps");
  return topic;
}

export async function updateTopic(id: string, data: {
  title?: string;
  description?: string;
  orderNumber?: number;
  estimatedHours?: number;
}) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const topic = await db.roadmapTopic.update({ where: { id }, data });
  revalidatePath("/dashboard/roadmaps");
  return topic;
}

export async function deleteTopic(id: string) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  await db.roadmapTopic.delete({ where: { id } });
  revalidatePath("/dashboard/roadmaps");
}

// ===================== RESOURCE ACTIONS =====================
export async function createResource(data: {
  topicId: string;
  title: string;
  url: string;
  resourceType: "DOCUMENTATION" | "YOUTUBE" | "ARTICLE" | "COURSE";
}) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  const resource = await db.topicResource.create({ data });
  revalidatePath("/dashboard/roadmaps");
  return resource;
}

export async function deleteResource(id: string) {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");
  await db.topicResource.delete({ where: { id } });
  revalidatePath("/dashboard/roadmaps");
}

// ===================== PROGRESS ACTIONS =====================
export async function joinRoadmap(roadmapId: string) {
  const session = await getSession();
  const existing = await db.userRoadmap.findFirst({
    where: { userId: session.user.id, roadmapId },
  });
  if (existing) throw new Error("Already joined");
  
  const ur = await db.userRoadmap.create({
    data: { userId: session.user.id, roadmapId },
  });

  // Create progress entries for all topics in bulk
  const topics = await db.roadmapTopic.findMany({ where: { roadmapId }, select: { id: true } });
  if (topics.length > 0) {
    await db.userTopicProgress.createMany({
      data: topics.map((topic) => ({
        userId: session.user.id,
        topicId: topic.id,
      })),
    });
  }

  await db.activityLog.create({
    data: { userId: session.user.id, activity: `Joined a new roadmap` },
  });

  revalidatePath("/dashboard");
  return ur;
}

export async function updateTopicStatus(topicId: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED", githubRepoUrl?: string) {
  const session = await getSession();
  const progress = await db.userTopicProgress.findFirst({
    where: { userId: session.user.id, topicId },
  });
  if (!progress) throw new Error("Progress not found");

  const updated = await db.userTopicProgress.update({
    where: { id: progress.id },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
      githubRepoUrl: githubRepoUrl || null,
    },
  });

  if (status === "COMPLETED") {
    await handleStreak(session.user.id);
    const topic = await db.roadmapTopic.findUnique({
      where: { id: topicId },
      include: { roadmap: true },
    });
    
    await db.activityLog.create({
      data: { userId: session.user.id, activity: `Completed topic: ${topic?.title}` },
    });

    // Check achievements
    if (topic) {
      const totalTopics = await db.roadmapTopic.count({ where: { roadmapId: topic.roadmapId } });
      const completedTopics = await db.userTopicProgress.count({
        where: { userId: session.user.id, status: "COMPLETED", topic: { roadmapId: topic.roadmapId } },
      });
      const percentage = Math.round((completedTopics / totalTopics) * 100);

      // Optimized Achievement Checking
      const achievements = await db.achievement.findMany({
        where: { requirementPercentage: { lte: percentage } },
      });
      
      if (achievements.length > 0) {
        const achievementIds = achievements.map(a => a.id);
        const existingEarned = await db.userAchievement.findMany({
          where: { userId: session.user.id, achievementId: { in: achievementIds } },
          select: { achievementId: true }
        });
        
        const earnedIds = new Set(existingEarned.map(e => e.achievementId));
        const newAchievements = achievements.filter(a => !earnedIds.has(a.id));

        if (newAchievements.length > 0) {
          // Bulk create user achievements
          await db.userAchievement.createMany({
            data: newAchievements.map(ach => ({
              userId: session.user.id,
              achievementId: ach.id
            }))
          });

          // Bulk create notifications & activity logs
          await db.notification.createMany({
            data: newAchievements.map(ach => ({
              userId: session.user.id,
              title: "Achievement Unlocked! 🏆",
              message: `Congratulations! You earned the "${ach.name}" badge: ${ach.description}`,
            }))
          });

          await db.activityLog.createMany({
            data: newAchievements.map(ach => ({
              userId: session.user.id,
              activity: `Earned achievement: ${ach.name}`,
            }))
          });
        }
      }
    }
  }

  revalidatePath("/dashboard");
  return updated;
}

export async function getUserProgress(roadmapId: string) {
  const session = await getSession();
  const topics = await db.roadmapTopic.findMany({
    where: { roadmapId },
    orderBy: { orderNumber: "asc" },
    include: {
      resources: true,
      userProgress: { where: { userId: session.user.id } },
    },
  });
  return topics;
}

// ===================== WEEKLY GOAL ACTIONS =====================
export async function getWeeklyGoals() {
  const session = await getSession();
  return db.weeklyGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createWeeklyGoal(data: { title: string; deadline: string }) {
  const session = await getSession();
  const goal = await db.weeklyGoal.create({
    data: { userId: session.user.id, title: data.title, deadline: new Date(data.deadline) },
  });
  revalidatePath("/dashboard/goals");
  return goal;
}

export async function completeGoal(id: string) {
  const session = await getSession();
  const goal = await db.weeklyGoal.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
  await db.activityLog.create({
    data: { userId: session.user.id, activity: `Completed goal: ${goal.title}` },
  });
  await handleStreak(session.user.id);
  revalidatePath("/dashboard/goals");
  return goal;
}

export async function deleteGoal(id: string) {
  await getSession();
  await db.weeklyGoal.delete({ where: { id } });
  revalidatePath("/dashboard/goals");
}

// ===================== NOTIFICATION ACTIONS =====================
export async function getNotifications() {
  const session = await getSession();
  return db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationRead(id: string) {
  await getSession();
  await db.notification.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const session = await getSession();
  await db.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/dashboard");
}

// ===================== ACTIVITY LOG ACTIONS =====================
export async function getActivityLogs() {
  const session = await getSession();
  return db.activityLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

// ===================== PROFILE ACTIONS =====================
export async function getProfile() {
  const session = await getSession();
  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, avatar: true, bio: true,
      githubUrl: true, githubUsername: true, isPublicProfile: true, linkedinUrl: true, role: true, isActive: true, createdAt: true,
      streakCount: true, lastActiveDate: true
    },
  });
}

export async function getLeaderboard() {
  await getSession();
  return db.user.findMany({
    where: { isPublicProfile: true, role: "USER" },
    select: {
      id: true,
      name: true,
      avatar: true,
      githubUsername: true,
      streakCount: true,
      _count: {
        select: {
          achievements: true,
          topicProgress: { where: { status: "COMPLETED" } }
        }
      }
    },
    orderBy: [
      { streakCount: 'desc' },
      { topicProgress: { _count: 'desc' } }
    ],
    take: 50
  });
}

export async function getPublicProfile(idOrUsername: string) {
  // First try to find by ID
  let user = await db.user.findFirst({
    where: { 
      OR: [
        { id: idOrUsername },
        { githubUsername: idOrUsername }
      ],
      isPublicProfile: true 
    },
    select: {
      id: true, name: true, avatar: true, bio: true,
      githubUrl: true, githubUsername: true, linkedinUrl: true, createdAt: true,
      streakCount: true,
      achievements: {
        include: { achievement: true }
      },
      topicProgress: {
        where: { status: "COMPLETED" },
        include: { topic: { include: { roadmap: { select: { title: true, slug: true } } } } }
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });

  return user;
}

export async function updateProfile(data: {
  name?: string;
  bio?: string;
  githubUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  isPublicProfile?: boolean;
}) {
  const session = await getSession();
  const user = await db.user.update({
    where: { id: session.user.id },
    data,
  });
  revalidatePath("/dashboard/profile");
  return user;
}

// ===================== DASHBOARD STATS =====================
export async function getUserDashboardStats() {
  const session = await getSession();
  const userId = session.user.id;

  const [roadmapsJoined, topicsCompleted, totalGoals, completedGoals, achievementCount, recentActivity] = await Promise.all([
    db.userRoadmap.count({ where: { userId } }),
    db.userTopicProgress.count({ where: { userId, status: "COMPLETED" } }),
    db.weeklyGoal.count({ where: { userId } }),
    db.weeklyGoal.count({ where: { userId, status: "COMPLETED" } }),
    db.userAchievement.count({ where: { userId } }),
    db.activityLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  // Get roadmap progress
  const userRoadmaps = await db.userRoadmap.findMany({
    where: { userId },
    include: {
      roadmap: {
        include: {
          category: true,
          _count: { select: { topics: true } },
        },
      },
    },
  });

  const roadmapProgress = await Promise.all(
    userRoadmaps.map(async (ur) => {
      const completed = await db.userTopicProgress.count({
        where: { userId, status: "COMPLETED", topic: { roadmapId: ur.roadmapId } },
      });
      const total = ur.roadmap._count.topics;
      return {
        id: ur.roadmap.id,
        title: ur.roadmap.title,
        slug: ur.roadmap.slug,
        category: ur.roadmap.category.name,
        difficulty: ur.roadmap.difficulty,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        completedTopics: completed,
        totalTopics: total,
      };
    })
  );

  return {
    roadmapsJoined,
    topicsCompleted,
    totalGoals,
    completedGoals,
    achievementCount,
    recentActivity,
    roadmapProgress,
  };
}

export async function getAdminDashboardStats() {
  const session = await getSession();
  if (session.user.role === "USER") throw new Error("Forbidden");

  const [totalUsers, totalRoadmaps, totalTopics] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.roadmap.count(),
    db.roadmapTopic.count(),
  ]);

  const popularRoadmaps = await db.roadmap.findMany({
    include: { _count: { select: { userRoadmaps: true } }, category: true },
    orderBy: { userRoadmaps: { _count: "desc" } },
    take: 5,
  });

  return { totalUsers, totalRoadmaps, totalTopics, popularRoadmaps };
}

export async function getSuperAdminStats() {
  const session = await getSession();
  if (session.user.role !== "SUPER_ADMIN") throw new Error("Forbidden");

  const [totalUsers, totalAdmins, totalRoadmaps, activeUsers] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "ADMIN" } }),
    db.roadmap.count(),
    db.user.count({ where: { isActive: true } }),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newRegistrations = await db.user.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  });

  return { totalUsers, totalAdmins, totalRoadmaps, activeUsers, newRegistrations };
}

// ===================== USER MANAGEMENT (Super Admin) =====================
export async function getAllUsers() {
  const session = await getSession();
  if (session.user.role !== "SUPER_ADMIN") throw new Error("Forbidden");
  return db.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN" | "SUPER_ADMIN") {
  const session = await getSession();
  if (session.user.role !== "SUPER_ADMIN") throw new Error("Forbidden");
  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/dashboard/users");
}

export async function toggleUserActive(userId: string) {
  const session = await getSession();
  if (session.user.role !== "SUPER_ADMIN") throw new Error("Forbidden");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  await db.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
  revalidatePath("/dashboard/users");
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (session.user.role !== "SUPER_ADMIN") throw new Error("Forbidden");
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/users");
}

// ===================== ADMIN MANAGEMENT (Super Admin) =====================
export async function createAdmin(data: { name: string; email: string; password: string }) {
  const session = await getSession();
  if (session.user.role !== "SUPER_ADMIN") throw new Error("Forbidden");
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await db.user.create({
    data: { name: data.name, email: data.email, password: hashedPassword, role: "ADMIN" },
  });
  revalidatePath("/dashboard/users");
}
