import { Github, Instagram } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-neutral-200 border-t border-neutral-800 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            <a href="/" className="inline-block">
              <span className="text-2xl font-extrabold bg-linear-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Anime
              </span>
            </a>
            <p className="text-sm text-neutral-400 max-w-sm">
              Discover, track and enjoy your favorite anime — new episodes,
              recommendations, and curated lists.
            </p>
            <p className="text-xs text-neutral-500">© {year} AniVerse. All rights reserved.</p>
          </div>

          <nav aria-label="Footer Navigation" className="md:col-span-1">
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="/" className="hover:underline text-neutral-200">Home</a>
              </li>
              <li>
                <a href="/browse" className="hover:underline text-neutral-200">Browse</a>
              </li>
              <li>
                <a href="/new-episodes" className="hover:underline text-neutral-200">New Episodes</a>
              </li>
              <li>
                <a href="/continue-watching" className="hover:underline text-neutral-200">Continue Watching</a>
              </li>
              <li>
                <a href="/about" className="hover:underline text-neutral-400">About</a>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start sm:items-end gap-3">
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-md hover:bg-neutral-800"
              >
                <Instagram className="h-5 w-5 text-neutral-100" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-md hover:bg-neutral-800"
              >
                <Github className="h-5 w-5 text-neutral-100" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
