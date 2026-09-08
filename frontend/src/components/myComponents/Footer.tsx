import { GithubIcon, InstagramIcon, TwitterIcon, YoutubeIcon, Tv2Icon } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white border-t border-white/5 mt-20 overflow-hidden">
      
      {/* Giant anime-style wordmark */}
      <div className="relative px-6 pt-16 pb-6 select-none overflow-hidden">
        <h2
          className="text-[clamp(4rem,14vw,11rem)] font-black leading-none tracking-tighter text-white/5 uppercase"
          style={{ fontFamily: "'Righteous', cursive", letterSpacing: "-0.04em" }}
        >
          AniVerse
        </h2>
        {/* subtle accent line on top of the wordmark */}
        <div className="absolute top-16 left-6 w-12 h-[3px] bg-blue-500 rounded-full" />
      </div>

      {/* Main link grid */}
      <div className="px-6 pb-10 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-10">

        {/* Discover */}
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">Descoperă</p>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              { label: "Acasă", href: "/" },
              { label: "Explorează", href: "/browse" },
              { label: "Episoade Noi", href: "/new-episodes" },
              { label: "Continuă Vizionarea", href: "/continue-watching" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="hover:text-white transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Genres */}
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">Genuri</p>
          <ul className="space-y-3 text-sm text-gray-400">
            {["Acțiune", "Dragoste", "Fantezie", "Horror", "Shonen", "Comedie"].map((g) => (
              <li key={g}>
                <a href="/browse" className="hover:text-white transition-colors duration-150">
                  {g}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">Cont</p>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              { label: "Favoritele Mele", href: "/favorites" },
              { label: "Listă de Urmărire", href: "/watchlist" },
              { label: "Profil", href: "/profile" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="hover:text-white transition-colors duration-150">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">Conectează-te</p>
          <div className="flex flex-col gap-3">
            {[
              { icon: <TwitterIcon size={15} />, label: "TwitterIcon / X", href: "https://x.com" },
              { icon: <InstagramIcon size={15} />, label: "InstagramIcon", href: "https://instagram.com" },
              { icon: <YoutubeIcon size={15} />, label: "YouTube", href: "https://youtube.com" },
              { icon: <GithubIcon size={15} />, label: "GitHub", href: "https://github.com" },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                {icon}
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-600 text-xs">
          <Tv2Icon size={13} />
          <span>COPYRIGHT © {year}</span>
          <span className="font-bold text-gray-400 tracking-widest uppercase">AniVerse</span>
        </div>
        <p className="text-xs text-gray-600 tracking-widest uppercase">
          ✦ Vizionează. Descoperă. Fascinează-te.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
