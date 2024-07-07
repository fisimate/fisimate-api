import prisma from "../lib/prisma.js";

const dashboard = async () => {
  const totalStudents = await prisma.user.count({
    where: {
      role: {
        name: "user",
      },
    },
  });

  const totalMaterials = await prisma.materialBank.count();
  const totalExams = await prisma.examBank.count();
  const totalFormulas = await prisma.formulaBank.count();

  const leaderboard = await prisma.quizAttempt.groupBy({
    by: ["userId"],
    _sum: {
      score: true,
    },
    orderBy: {
      _sum: {
        score: "desc",
      },
    },
    take: 5,
  });

  // User data for leaderboard
  const leaderboardWithUsers = await Promise.all(
    leaderboard.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: {
          id: true,
          email: true,
          fullname: true,
          nis: true,
          profilePicture: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });
      return {
        ...entry,
        user,
      };
    })
  );

  // Quiz attempts per month
  const quizAttemptsPerMonth = await prisma.quizAttempt.groupBy({
    by: ["attemptAt"],
    _count: {
      _all: true,
    },
  });

  // Format the data for chart
  const attemptsPerMonthChart = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    count: 0,
  }));

  quizAttemptsPerMonth.forEach((attempt) => {
    const month = new Date(attempt.attemptAt).getMonth();
    attemptsPerMonthChart[month].count += attempt._count._all;
  });

  // Return all data
  return {
    totalStudents,
    totalMaterials,
    totalExams,
    totalFormulas,
    leaderboard: leaderboardWithUsers,
    attemptsPerMonthChart,
  };
};

const getLeaderboard = async (req) => {
  const { take } = req.query;

  const takeInt = take ? parseInt(take, 10) : undefined;

  const leaderboard = await prisma.quizAttempt.groupBy({
    by: ["userId"],
    _sum: {
      score: true,
    },
    orderBy: {
      _sum: {
        score: "desc",
      },
    },
    take: takeInt,
  });

  // User data for leaderboard
  const leaderboardWithUsers = await Promise.all(
    leaderboard.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: {
          id: true,
          email: true,
          fullname: true,
          nis: true,
          profilePicture: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });
      return {
        ...entry,
        user,
      };
    })
  );

  return leaderboardWithUsers;
};

export default {
  dashboard,
  getLeaderboard,
};
