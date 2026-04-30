Now update BlogDetail to fetch by id and use backend body:
Action: file_editor create /app/frontend/src/pages/BlogDetail.jsx --file-text "import React, { useEffect, useState } from \"react\";
import { Link, useParams } from \"react-router-dom\";
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from \"lucide-react\";
import Navbar from \"../components/Navbar\";
import Footer from \"../components/Footer\";
import { posts as fallbackPosts, personal } from \"../mock\";
import { getPost, getPosts } from \"../api\";

const placeholderBody = [
  \"This is a placeholder for the full article body. In production, this content would come from your CMS or markdown files.\",
  \"Thanks for reading. If this resonated, I'd love to hear from you.\"
];

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(
    fallbackPosts.find((p) => p.id === id) || fallbackPosts[0]
  );
  const [others, setOthers] = useState(
    fallbackPosts.filter((p) => p.id !== id).slice(0, 2)
  );

  useEffect(() => {
    let alive = true;
    // scroll to top on id change
    window.scrollTo(0, 0);
    getPost(id)
      .then((data) => { if (alive && data) setPost(data); })
      .catch((err) => console.error(\"getPost failed\", err));
    getPosts()
      .then((data) => {
        if (alive && Array.isArray(data)) {
          setOthers(data.filter((p) => p.id !== id).slice(0, 2));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [id]);

  const body = (post && post.body && post.body.length) ? post.body : placeholderBody;

  return (
    <div className=\"bg-[#0b0b0c] text-white min-h-screen\">
      <Navbar />
      <main className=\"pt-28 pb-24\">
        <article className=\"max-w-3xl mx-auto px-6 lg:px-10\">
          <Link to=\"/blog\" className=\"mono text-xs text-white/50 hover:text-[#d4fb3a] inline-flex items-center gap-2 mb-10\">
            <ArrowLeft className=\"w-3.5 h-3.5\" /> All posts
          </Link>

          <span className=\"mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-[#d4fb3a]/10 text-[#d4fb3a] border border-[#d4fb3a]/20\">
            {post.tag}
          </span>
          <h1 className=\"serif text-4xl md:text-6xl font-medium tracking-tight leading-[1.02] mt-6\">
            {post.title}
          </h1>
          <div className=\"mt-6 flex items-center gap-5 text-white/50 flex-wrap\">
            <span className=\"mono text-xs flex items-center gap-1.5\"><Calendar className=\"w-3.5 h-3.5\" /> {post.date}</span>
            <span className=\"mono text-xs flex items-center gap-1.5\"><Clock className=\"w-3.5 h-3.5\" /> {post.readTime} read</span>
            <span className=\"mono text-xs\">by {personal.name}</span>
          </div>

          <div className=\"mt-10 aspect-[16/9] rounded-2xl overflow-hidden border border-white/10\">
            <img src={post.cover} alt={post.title} className=\"w-full h-full object-cover\" />
          </div>

          <div className=\"mt-10 space-y-6 text-white/80 text-[17px] leading-[1.75]\">
            <p className=\"serif text-2xl leading-[1.4] text-white\">{post.excerpt}</p>
            {body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>

        {others.length > 0 && (
          <section className=\"max-w-5xl mx-auto px-6 lg:px-10 mt-24\">
            <div className=\"flex items-center gap-4 mb-8\">
              <span className=\"mono text-xs text-[#d4fb3a] tracking-widest uppercase\">Keep reading</span>
              <div className=\"h-px flex-1 bg-white/10\" />
            </div>
            <div className=\"grid md:grid-cols-2 gap-6\">
              {others.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.id}`}
                  className=\"group rounded-2xl border border-white/10 overflow-hidden bg-[#0f0f10] hover:border-white/20 transition-colors\"
                >
                  <div className=\"aspect-[16/9] overflow-hidden\">
                    <img src={p.cover} alt={p.title} className=\"w-full h-full object-cover group-hover:scale-105 transition-transform duration-700\" />
                  </div>
                  <div className=\"p-6\">
                    <p className=\"mono text-[11px] text-white/40\">{p.date}</p>
                    <h3 className=\"serif text-xl font-medium mt-2 group-hover:text-[#d4fb3a] transition-colors\">{p.title}</h3>
                    <span className=\"mt-3 inline-flex items-center gap-1.5 mono text-[11px] text-white/50\">
                      Read article <ArrowUpRight className=\"w-3.5 h-3.5\" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
"
Observation: Overwrite successful: /app/frontend/src/pages/BlogDetail.jsx
