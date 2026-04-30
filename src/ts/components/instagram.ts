interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: "IMAGE" | "CAROUSEL_ALBUM" | "VIDEO";
}

const token = import.meta.env.VITE_INSTAGRAM_TOKEN as string | undefined;
const userId = import.meta.env.VITE_INSTAGRAM_USER_ID as string | undefined;

async function loadInstagram() {
  if (!token || !userId) {
    console.warn("Instagram: VITE_INSTAGRAM_TOKEN または VITE_INSTAGRAM_USER_ID が設定されていません");
    return;
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink,media_type&access_token=${token}`
    );
    const data = await res.json() as { data?: InstagramPost[] };
    const feed = document.getElementById("insta-feed");
    if (!feed || !Array.isArray(data.data)) return;

    const posts = data.data.slice(0, 4);

    posts.forEach((post) => {
      if (["IMAGE", "CAROUSEL_ALBUM", "VIDEO"].includes(post.media_type)) {
        const item = document.createElement("a");
        item.href = post.permalink;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
        item.className = "p-instagram__item";

        const img = document.createElement("img");
        img.src = post.media_url;
        img.alt = (post.caption ?? "").slice(0, 50);
        item.appendChild(img);

        feed.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Instagram API Error:", err);
  }
}

loadInstagram();
