import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Route: GET /api/leetcode/:username
router.get("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    // 1️⃣ Query: user profile (total solved)
    const userProfileQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
              totalSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username },
    };

    // 2️⃣ Query: recent accepted submissions
    const submissionQuery = {
      query: `
        query recentAcSubmissions($username: String!) {
          recentAcSubmissionList(username: $username) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `,
      variables: { username },
    };

    // Fetch both queries from LeetCode GraphQL API
    const [profileRes, submissionsRes] = await Promise.all([
      fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfileQuery),
      }),
      fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionQuery),
      }),
    ]);

    const profileData = await profileRes.json();
    const submissionsData = await submissionsRes.json();

    // Extract totals
    const totalSolved =
      profileData.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find(
        (d) => d.difficulty === "All"
      )?.count || 0;

    const totalQuestions =
      profileData.data?.matchedUser?.submitStatsGlobal?.totalSubmissionNum?.find(
        (d) => d.difficulty === "All"
      )?.count || 0;

    const recent = submissionsData.data?.recentAcSubmissionList?.slice(0, 10) || [];

    res.json({
      username,
      totalSolved,
      totalQuestions,
      recent,
    });
  } catch (err) {
    console.error("❌ LeetCode API error:", err);
    res.status(500).json({ message: "Failed to fetch from LeetCode", error: err });
  }
});

export default router;
