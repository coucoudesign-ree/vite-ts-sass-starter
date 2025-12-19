const token = "YOUR_INSTAGRAM_ACCESS_TOKEN";
const userId = "YOUR_USER_ID";

async function loadInstagram() {
  try {
    const res = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink,media_type&access_token=${token}`
    );
    const data = await res.json();
    const feed = document.getElementById("insta-feed");
    const posts = data.data.slice(0, 4);

    posts.forEach((post) => {
      if (["IMAGE", "CAROUSEL_ALBUM", "VIDEO"].includes(post.media_type)) {
        const item = document.createElement("a");
        item.href = post.permalink;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
        item.className = "p-instagram__item";
        item.innerHTML = `<img src="${post.media_url}" alt="${(post.caption || "").slice(0, 50)}">`;
        feed?.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Instagram API Error:", err);
  }
}

loadInstagram();
