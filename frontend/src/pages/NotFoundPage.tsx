import { useNavigate } from "react-router-dom";
import sukunaGif from "../assets/sukuna-mahoraga.gif";
import FuzzyText from "@/components/myComponents/FuzzyText";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 font-sans">

      {/* 404 Graphic Area */}
      <div className="flex items-center justify-center mb-6">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.6}
          enableHover={true}
          fontSize="clamp(10rem, 18vw, 18rem)"
          fontWeight={900}
          color="#ffffff"
        >
          4
        </FuzzyText>

        {/* The GIF replacement */}
        <div className="mx-2 md:mx-6 flex items-center justify-center">
          <img
            src={sukunaGif}
            alt="Sukuna Mahoraga"
            className="w-48 md:w-72 h-auto object-contain rounded-lg"
          />
        </div>

        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.6}
          enableHover={true}
          fontSize="clamp(10rem, 18vw, 18rem)"
          fontWeight={900}
          color="#ffffff"
        >
          4
        </FuzzyText>
      </div>

      {/* Text Content */}
      <div className="text-center flex flex-col items-center z-20">
        <h1 className="text-3xl md:text-[2.5rem] font-medium text-white mb-4 tracking-tight">
           Se pare că te-ai rătăcit puțin!
        </h1>

        <p className="text-gray-400 text-sm md:text-base mb-10 font-medium">
           Pagina pe care o căutai nu există
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] text-sm"
        >
           Înapoi
        </button>
      </div>

    </div>
  );
};

export default NotFoundPage;
