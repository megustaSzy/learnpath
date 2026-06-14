import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch user context from database
    const userId = (session.user as any).id;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        role: true,
        streakCount: true,
        githubUsername: true,
        userRoadmaps: {
          select: {
            roadmap: {
              select: { title: true, difficulty: true, category: { select: { name: true } } }
            }
          }
        },
        topicProgress: {
          where: { status: "COMPLETED" },
          select: { topic: { select: { title: true } } },
          take: 10,
          orderBy: { completedAt: "desc" }
        },
        weeklyGoals: {
          where: { status: "PENDING" },
          select: { title: true, deadline: true },
          take: 5
        },
        achievements: {
          select: { achievement: { select: { name: true } } },
          take: 10
        }
      }
    });

    const joinedRoadmaps = user?.userRoadmaps.map(ur => `${ur.roadmap.title} (${ur.roadmap.difficulty}, ${ur.roadmap.category.name})`).join(", ") || "None";
    const completedTopics = user?.topicProgress.map(tp => tp.topic.title).join(", ") || "None";
    const activeGoals = user?.weeklyGoals.map(g => `${g.title} (deadline: ${g.deadline ? new Date(g.deadline).toLocaleDateString() : "no deadline"})`).join(", ") || "None";
    const earnedBadges = user?.achievements.map(a => a.achievement.name).join(", ") || "None";

    const systemPrompt = `You are LearnPathX Assistant, a friendly and knowledgeable AI learning coach built into the LearnPathX platform.

ABOUT LEARNPATHX:
LearnPathX is a gamified web-based educational platform for developers. It provides structured learning roadmaps, tracks progress, features daily learning streaks, a global leaderboard, achievement badges, GitHub integration for linking repositories to completed topics, and public portfolio profiles.

CURRENT USER CONTEXT:
- Name: ${user?.name || "Unknown"}
- Role: ${user?.role || "USER"}
- Learning Streak: ${user?.streakCount || 0} days
- GitHub Username: ${user?.githubUsername || "Not set"}
- Joined Roadmaps: ${joinedRoadmaps}
- Recently Completed Topics: ${completedTopics}
- Active Weekly Goals: ${activeGoals}
- Earned Badges: ${earnedBadges}

YOUR RESPONSIBILITIES:
1. Help users navigate and use LearnPathX features effectively.
2. Provide personalized learning advice based on their current progress and roadmaps.
3. Motivate users to maintain their learning streaks and complete goals.
4. Suggest next topics or roadmaps based on their learning history.
5. Answer questions about programming concepts related to the roadmaps they're studying.
6. Be encouraging, supportive, and concise.

RULES:
- Always respond in the same language the user uses (Indonesian or English).
- Keep responses concise (max 3-4 paragraphs).
- Use emojis sparingly to keep the tone friendly.
- If a user asks something completely unrelated to learning/tech, gently redirect them back to their learning journey.
- Never share sensitive user data or system internals.`;

    // Build contents array with conversation history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add previous conversation history
    if (Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const reply = response.text || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
