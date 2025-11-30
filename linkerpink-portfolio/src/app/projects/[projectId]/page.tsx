  "use client";


import MediaCard from "../media-card";
import { allProjects } from "../all-projects";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useTheme } from "../../theme-context";
import CodeBlock from "../code-block";

  // Small helper to render descriptions with clickable links.
  // Supports Markdown-style links: [label](https://...)
  // and plain URLs like https://example.com
  function renderDescription(text?: string) {
    if (!text) return null;
  const nodes: Array<React.ReactNode> = [];
    let cursor = 0;
    let keyId = 0;

    const mdRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
    const urlRe = /(https?:\/\/[^\s)]+)/;

    while (cursor < text.length) {
      const rest = text.slice(cursor);
      const mdMatch = mdRe.exec(rest);
      const urlMatch = urlRe.exec(rest);

      // find earliest match (if any)
      let nextType: "md" | "url" | null = null;
      let match: RegExpExecArray | null = null;
      if (mdMatch && urlMatch) {
        nextType = mdMatch.index <= urlMatch.index ? "md" : "url";
        match = nextType === "md" ? mdMatch : urlMatch;
      } else if (mdMatch) {
        nextType = "md";
        match = mdMatch;
      } else if (urlMatch) {
        nextType = "url";
        match = urlMatch;
      }

      if (!nextType || !match) {
        // no more links
        nodes.push(rest);
        break;
      }

      // push text before the match
      if (match.index > 0) {
        nodes.push(rest.slice(0, match.index));
      }

      if (nextType === "md") {
        const [, label, href] = match;
        nodes.push(
          <a
            key={`desc-link-${keyId++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] underline"
          >
            {label}
          </a>
        );
        cursor += match.index + match[0].length;
      } else {
        // plain url
        const [url] = match;
        nodes.push(
          <a
            key={`desc-link-${keyId++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] underline"
          >
            {url}
          </a>
        );
        cursor += match.index + url.length;
      }
    }

    return nodes.map((n, i) => (typeof n === "string" ? <span key={i}>{n}</span> : n));
  }

export default function ProjectDetails() {
  const { projectId } = useParams() as { projectId: string };
  const { theme } = useTheme();
  const project = allProjects.find((p) => p.slug === projectId);

  if (!project) {
    notFound();
  }

  const media = project.media ?? [];
  // Ensure display order: images -> gifs -> youtube -> videos
  const mediaOrder = ["image", "gif", "youtubeId", "video"];
  const sortedMedia = [...media].sort(
    (a, b) => mediaOrder.indexOf(a.type) - mediaOrder.indexOf(b.type)
  );

  // Attach a per-type index to each media item so captions can show
  // the media type and its sequential number (e.g. "Image 1", "GIF 2").
  // Treat YouTube embeds as videos for numbering purposes so both
  // share the same "Video N" sequence.
  const typeCounters: Record<string, number> = { image: 0, gif: 0, video: 0 };
  const mediaWithIndex = sortedMedia.map((m) => {
    const rawType = m.type as string;
    const key = rawType === "youtubeId" ? "video" : rawType;
    typeCounters[key] = (typeCounters[key] || 0) + 1;
    return { ...m, typeIndex: typeCounters[key] };
  });

  // Theme-based card classes
  const cardBgClass = theme === 'dark' ? 'bg-[#232323]' : theme === 'secret' ? 'bg-pink-200' : 'bg-white';
  const borderClass = theme === 'dark' ? 'border-[#555555]' : theme === 'secret' ? 'border-pink-400' : 'border-white';
  const textColor = theme === 'dark' ? '#FFFFFF' : theme === 'secret' ? '#be194e' : '#000000';
  const descriptionTextColor = theme === 'dark' ? '#ffffffff' : theme === 'secret' ? '#a01546' : '#5F5F5F';
  const hrBorderColor = theme === 'dark' ? '#555555' : theme === 'secret' ? '#ec4899' : '#BEBEBE';

  return (
    <div className="min-h-screen relative px-6" style={{ color: textColor }}>
        {/* Banner */}
        {project.banner && (
          <div className="w-full mb-10 rounded-3xl overflow-hidden aspect-[10/3] shadow-[0px_3px_6px_rgba(0,0,0,0.5)] select-none">
            <Image
              src={project.banner}
              alt={`${project.title} Banner`}
              width={2560}
              height={2560}
              className="w-full h-full object-cover banner-animate"
              priority
              draggable={false}
            />
          </div>
        )}

        {/* Title + Icon + Date */}

      <header className="mb-10 flex flex-col md:flex-row gap-4 items-center">
        {/* Left: Icon + Title Block */}
        <div className={`flex-1 ${cardBgClass} rounded-3xl p-5 ${theme === 'secret' ? 'border-4 border-pink-400' : ''}`}>
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4">
            {project.icon && (
              <Image
                src={project.icon}
                alt={`${project.title} Icon`}
                width={512}
                height={512}
                className={`w-38 h-38 object-cover rounded-3xl border-8 ${borderClass} shadow-[0px_0px_6px_rgba(0,0,0,0.5)] aspect-[1/1] banner-animate select-none`}
                draggable={false}
              />
            )}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-2xl font-extrabold leading-tight user-select-none select-none">
                {project.title}
              </h1>
              <p className="text-sm mt-2 user-select-none select-none" style={{ color: descriptionTextColor }}>
                {project.displayDate}
              </p>

              {project.technologies.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap justify-center md:justify-start">
                  {project.technologies.map((icon, i) => (
                    <Image
                      key={i}
                      src={icon}
                      alt="tech"
                      width={512}
                      height={512}
                      className="w-8 h-8 object-contain user-select-none select-none"
                      draggable={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Button Container */}
        {(project.href || project.github) && (
          <div className={`w-full md:w-[250px] shrink-0 ${cardBgClass} rounded-3xl p-6 flex flex-col gap-4 self-center ${theme === 'secret' ? 'border-4 border-pink-400' : ''}`}>
              {/* View Project (dynamic platform) */}
              {project.href && (
                <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-2.5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold interactable-object select-none ${theme === 'secret' ? 'ring-2 ring-pink-400' : ''}`}
                draggable={false}
                >
                  <Image
                    src={
                      project.platform?.toLowerCase().includes("gx")
                      ? "/images/gx games logo.jpg"
                      : "/images/itch.io logo.png"
                    }
                    alt={`${project.platform || "Platform"} Logo`}
                    width={48}
                    height={48}
                    draggable={false}
                    className="rounded-md select-none"
                    />
                  View on {project.platform || "Platform"}
                </a>
              )}

              {/* GitHub */}
              {project.github && (
                <a
                href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-900 text-white font-semibold interactable-object select-none ${theme === 'secret' ? 'ring-2 ring-pink-400' : ''}`}
                  draggable={false}
                  >
                  <Image
                    src="/images/github logo.svg"
                    alt="GitHub Icon"
                    width={48}
                    height={48}
                    draggable={false}
                    className="rounded-md select-none"
                    />
                  View on GitHub
                </a>
              )}
            </div>
          )}
        </header>
          {/* Combined Media (images, gifs, youtube embeds, videos last) */}
          {sortedMedia.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 user-select-none select-none">
                <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm user-select-none select-none" />
                Media
              </h2>
              <hr className="border-t-2 mb-6" style={{ borderColor: hrBorderColor }} />
              <div className="flex flex-wrap justify-center gap-3">
                {mediaWithIndex.map((mediaItem, i) => {
                  const labelMap: Record<string, string> = {
                    image: 'Image',
                    gif: 'GIF',
                    youtubeId: 'Video',
                    video: 'Video',
                  };
                  const typeLabel = labelMap[mediaItem.type as string] || (mediaItem.type as string);
                  const caption = `${typeLabel} ${mediaItem.typeIndex ?? i + 1}`;

                  switch (mediaItem.type) {
                    case "image":
                      return (
                        <MediaCard
                          key={i}
                          imgSrc={mediaItem.src}
                          title={caption}
                          size="small"
                        />
                      );
                    case "gif":
                      return (
                        <MediaCard
                          key={i}
                          gifSrc={mediaItem.src}
                          title={caption}
                          size="small"
                        />
                      );
                    case "youtubeId":
                      return (
                        <MediaCard
                          key={i}
                          youtubeId={mediaItem.src}
                          title={caption}
                          size="small"
                        />
                      );
                    case "video":
                      return (
                        <MediaCard
                          key={i}
                          videoSrc={mediaItem.src}
                          title={caption}
                          size="large"
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </section>
          )}
  

        {/* Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 user-select-none select-none">
            <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm user-select-none select-none" />
            Software Description
          </h2>
          <hr className="border-t-2 mb-6" style={{ borderColor: hrBorderColor }} />
          <div className={`${cardBgClass} rounded-3xl p-6 ${theme === 'secret' ? 'border-4 border-pink-400' : ''}`}>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: descriptionTextColor }}>
              {renderDescription(project.description)}
            </p>
          </div>
        </section>

        {/* Code Snippets */}
        <section className="mb-10 user-select-none select-none">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 user-select-none select-none">
            <span className="w-1.5 h-6 bg-[#F57C00] rounded-sm user-select-none select-none" />
            What I made
          </h2>
          <hr className="border-t-2 mb-6" style={{ borderColor: hrBorderColor }} />

          {project.codeSnippets && project.codeSnippets.length > 0 && (
            <section className="mb-8">
              {project.codeSnippets.map((snippet, i) => {
                const { language, name, description, code } = snippet as any;
                const videoSrc = "videoSrc" in snippet ? (snippet as any).videoSrc : undefined;
                return (
                  <div
                    key={i}
                    className="mb-6 rounded-md overflow-hidden"
                  >
                    <CodeBlock
                      language={language}
                      name={name}
                      description={description}
                      videoSrc={videoSrc}
                    >
                      {code}
                    </CodeBlock>
                  </div>
                );
              })}
            </section>
          )}
        </section>
      </div>
    );
  }
