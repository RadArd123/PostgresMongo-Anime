import React from "react";
import { Clock } from "lucide-react";

type Episode = {
  id: number;
  title: string;
  episodeLabel: string;
  typeLabel: string;
  thumb: string;
  time: string;
};

const episodesToday: Episode[] = [
  {
    id: 1,
    title: "Hands off!: Sawaranaide Kotessashi-kun Season 1",
    episodeLabel: "Episode 8",
    typeLabel: "Subtitled",
    thumb: "src/assets/onepiece1.jpg",
    time: "6:35pm",
  },
  {
    id: 2,
    title: "One-Punch Man Season 3",
    episodeLabel: "Episode 7",
    typeLabel: "Subtitled",
    thumb: "src/assets/one-piece.jpeg",
    time: "5:15pm",
  },
  {
    id: 3,
    title: "Digimon Beatbreak Season 1",
    episodeLabel: "Episode 8",
    typeLabel: "Subtitled",
    thumb: "src/assets/Dandadan.jpg",
    time: "5:00am",
  },
  {
    id: 4,
    title: "One Piece: Egghead Island (1123-Current)",
    episodeLabel: "Episode -SP21",
    typeLabel: "Subtitled",
    thumb: "src/assets/one-piece.jpeg",
    time: "6:00pm",
  },
  {
    id: 5,
    title: "Gachiakuta Season 1",
    episodeLabel: "Episode 20",
    typeLabel: "Subtitled",
    thumb: "src/assets/Dandadan.jpg",
    time: "5:00pm",
  },
  {
    id: 6,
    title: "(Dubs) Gachiakuta",
    episodeLabel: "7 Episodes",
    typeLabel: "Sub | Dub",
    thumb: "src/assets/onepiece1.jpg",
    time: "5:30pm",
  },
];

const NewEpisodesSection: React.FC = () => {
  return (
    <section className="w-full ">
      <div className="max-w-8xl mx-auto">

        <div className="border-l-4 border-blue-700 pl-4 mb-8 px-4">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
            New Episodes
          </h1>
          <p className="text-gray-400 mt-2">
            Today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {episodesToday.map((ep) => (
            <div
              key={ep.id}
              className="flex items-center p-5 rounded-xl hover:bg-gray-800 gap-4 bg-transparent "
            >
              {/* thumbnail */}
              <div className="w-20 h-12 md:w-28 md:h-16 shrink-0 rounded overflow-hidden ">
                <img
                  src={ep.thumb}
                  alt={ep.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* title + meta */}
              <div className="flex-1">
                <div className="text-white font-semibold truncate">
                  {ep.title}
                </div>
                <div className="text-sm text-blue-100/60 mt-1 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-xs bg-blue-500/10 text-blue-200 px-2 py-0.5 rounded">
                    <svg
                      className="w-3 h-3 text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.419 8.301L12 18.896 4.581 23.9 6 15.6 0 9.748l8.332-1.73L12 .587z" />
                    </svg>
                    <span className="text-xs">{ep.episodeLabel}</span>
                  </span>
                </div>
              </div>
              {/* time on right */}
              <div className="md:flex text-sm text-blue-400 font-medium hidden ">
                <Clock className="inline w-4 h-4 mr-1 mt-px text-blue-300" />
                <span>{ep.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewEpisodesSection;
