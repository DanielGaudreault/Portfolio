import React, { useEffect, useState } from \"react\";
import { ArrowUpRight } from \"lucide-react\";
import { projects as fallbackProjects } from \"../mock\";
import { getProjects } from \"../api\";

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  useEffect(() => {
    let alive = true;
    getProjects()
      .then((data) => {
        if (alive && Array.isArray(data) && data.length) setProjects(data);
      })
      .catch((err) => console.error(\"getProjects failed\", err));
    return () => { alive = false; };
  }, []);
