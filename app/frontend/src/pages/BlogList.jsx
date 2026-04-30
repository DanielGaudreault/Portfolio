import React, { useEffect, useState } from \"react\";
import { Link } from \"react-router-dom\";
import { ArrowUpRight, Clock, ArrowLeft } from \"lucide-react\";
import Navbar from \"../components/Navbar\";
import Footer from \"../components/Footer\";
import { posts as fallbackPosts } from \"../mock\";
import { getPosts } from \"../api\";

export default function BlogList() {
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
