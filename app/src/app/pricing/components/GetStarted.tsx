export default function TrustBanner() {
    return (
      <section className="bg-[#b23878] text-white px-6 py-20 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
              Mockey AI is trusted by 1M+ designers, photographers, brands, and corporates globally!
            </h2>
            <p className="text-pink-200 text-base sm:text-lg">
              Mockey caters to 1M+ users every month from 50+ countries around the world.<br />
              When you subscribe to Mockey Pro, trust that you are in good hands ❤️
            </p>
          </div>
          <div>
            <button className="bg-white text-black font-medium px-6 py-3 rounded-lg shadow-sm hover:bg-pink-100 transition">
              Get started
            </button>
          </div>
        </div>
      </section>
    );
  }
  
