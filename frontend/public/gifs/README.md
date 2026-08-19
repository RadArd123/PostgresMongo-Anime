# Anime Fight Scene GIFs

To use local GIFs for the login and signup backgrounds:
1. Download or save your favorite anime `.gif` or `.webp` fight animations into this folder (`frontend/public/gifs/`).
2. Name them simply, for example: `gojo.gif`, `zoro.gif`, `jinwoo.gif`.
3. In `frontend/src/components/myComponents/AnimeFightBackground.tsx`, update the `url` property in `FIGHT_SCENES` to point to `/gifs/your-file.gif`. Example:
   ```ts
   {
     title: "Gojo vs Sukuna • Hollow Purple",
     anime: "Jujutsu Kaisen",
     url: "/gifs/gojo.gif",
     badgeColor: "from-purple-600 to-indigo-600",
   }
   ```
This ensures your GIFs load instantly, never break, and work 100% offline and in production!
