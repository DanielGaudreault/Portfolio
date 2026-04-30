import React, { useEffect, useState } from \"react\";
import { Link } from \"react-router-dom\";
import { ArrowUpRight, Clock } from \"lucide-react\";
import { posts as fallbackPosts } from \"../mock\";
import { getPosts } from \"../api\";

export default function BlogPreview() {
  const [posts, setPosts] = useState(fallbackPosts);
  useEffect(() => {
    let alive = true;
    getPosts()
      .then((data) => {
        if (alive && Array.isArray(data) && data.length) setPosts(data);
      })
      .catch((err) => console.error(\"getPosts failed\", err));
    return () => { alive = false; };
  }, []);
