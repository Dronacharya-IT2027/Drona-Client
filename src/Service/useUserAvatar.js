import { useEffect, useState } from "react";

const DEFAULT_AVATAR = "https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png";

// Extract GitHub username from URL
const getGitHubUsername = (githubUrl) => {
  if (!githubUrl) return null;
  const parts = githubUrl.split("github.com/");
  return parts[1]?.split("/")[0] || null;
};

// Fetch GitHub avatar URL
const fetchGitHubAvatar = async (githubUrl) => {
  const username = getGitHubUsername(githubUrl);
  if (!username) return null;

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();
    return data.avatar_url || null; // GitHub ALWAYS returns a photo
  } catch (error) {
    return null;
  }
};

export function useUserAvatar(user) {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    async function loadAvatar() {
      // 1. Try GitHub
      if (user.github) {
        const gitPhoto = await fetchGitHubAvatar(user.github);
        if (gitPhoto) {
          setAvatar(gitPhoto);
          return;
        }
      }

      // 2. Fallback to default avatar
      setAvatar(DEFAULT_AVATAR);
    }

    loadAvatar();
  }, [user.github]);

  return avatar;
}
