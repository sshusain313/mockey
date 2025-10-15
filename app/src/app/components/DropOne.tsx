export default function DropOne() {
    return (
      <div className="bg-[#b1397d] min-h-[300px] flex items-center justify-between px-6 sm:px-12 py-12">
        <div className="max-w-2xl text-white">
          <h2 className="font-['Bricolage_Grotesque'] text-[60px] leading-[60px] font-[700] text-[#000000] tracking-normal mb-4">
            Mockey AI is trusted by 1M+ designers, photographers, brands, and corporates globally!
          </h2>
          <p className="text-pink-200 text-base sm:text-lg">
            Mockey caters to 1M+ users every month from 50+ countries around the world.
            <br />
            When you subscribe to Mockey Pro, trust that you are in good hands <span className="text-white">❤️</span>
          </p>
        </div>
  
        <div className="hidden sm:flex">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-gray-100 transition">
            Get started
          </button>
        </div>
      </div>
    );
  }
  
