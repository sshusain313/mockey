import {
  BadgePercent,
  Rocket,
  Sparkles,
  Camera,
  Headset,
  UserCircle2,
  Atom,
  LayoutTemplate,
} from "lucide-react";

export default function EnterprisePage() {
  return (
    <div className="bg-white flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 my-8 sm:my-12">
      <div className="max-w-6xl w-full bg-gradient-to-b from-pink-500 to-purple-900 rounded-2xl p-6 sm:p-8 md:p-10 text-white grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* Left Column: Text + Form */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
            Mockey for Enterprise
          </h2>
          <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
            Enterprise offering is ideal for E-commerce brands, marketing
            agencies, and corporates with a minimum budget of $500/month.
            Contact us with your requirements.
          </p>

          <form className="space-y-3 sm:space-y-4 max-w-md">
            <div className="relative">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-black text-xs sm:text-sm placeholder-gray-400 outline-none"
                required
              />
              <span className="absolute top-0 right-1 text-black text-xs sm:text-sm">*</span>
            </div>

            <textarea
              placeholder="Message / Requirements"
              className="w-full rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-black text-xs sm:text-sm placeholder-gray-400 outline-none"
              rows={3}
            />

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="submit"
                className="bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold flex items-center gap-1 sm:gap-2 hover:bg-gray-800 transition"
              >
                Request Callback <span>→</span>
              </button>

              <div className="bg-white p-2 rounded-md text-pink-600">
                <Sparkles />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
          {[
            {
              icon: <LayoutTemplate size={16} />,
              text: "On-demand reusable mockup template creation from your brand photos",
            },
            {
              icon: <Atom size={16} />,
              text: "On-demand 3D mockup creation",
            },
            {
              icon: <Camera size={16} />,
              text: "AI Product Photoshoot – Generate professional quality product photos using AI",
            },
            {
              icon: <Headset size={16} />,
              text: "24/7, 1:1 Priority Support",
            },
            {
              icon: <Rocket size={16} />,
              text: "Express delivery of custom mockups with 48 hours turnaround time.",
            },
            {
              icon: <UserCircle2 size={16} />,
              text: "Dedicated relationship manager",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 sm:gap-3">
              <div className="bg-white text-pink-600 p-1.5 rounded-full flex-shrink-0">
                {item.icon}
              </div>
              <p className="text-xs sm:text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
