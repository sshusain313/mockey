import {
    Mail,
    Zap,
    Download,
    Camera,
    Gem,
    BadgePercent,
    FileImage,
    MonitorSmartphone,
    Headset,
    Heart,
  } from "lucide-react";
  
  const features = [
    {
      icon: <Mail />,
      title: "On-Demand Custom Mockup",
      description:
        "Need mockups for specific products, models, and poses? Or custom (re-usable) mockups of your own products? With Enterprise plan, you can leverage Mockey team's expertise and get custom mockups made within 48 hours.",
    },
    {
      icon: <Zap />,
      title: "1000+ AI Mockup Templates",
      description:
        "An all-in-one customer service platform that helps you balance everything your customers need to be happy.",
    },
    {
      icon: <Download />,
      title: "Download in JPG & PNG",
      description:
        "Download your mockups and images down in multiple supported formats, JPG and PNG. Get the right image format for your use case.",
    },
    {
      icon: <Camera />,
      title: "AI Product Photography",
      description:
        "Upload your product images of apparels, furniture, cosmetics, etc, remove image background, and generate professional quality photo shoot output from text prompt.",
    },
    {
      icon: <Gem />,
      title: "Unlimited Premium Mockups",
      description:
        "Access ever growing library of premium mockups to make your brand, design, and products stand out from the crowd.",
    },
    {
      icon: <BadgePercent />,
      title: "Go Ads Free",
      description:
        "Go Ads free on Mockey editor. Pro and Enterprise plan users won’t see Ads on the website and in editor workflow.",
    },
    {
      icon: <FileImage />,
      title: "Access PSD files",
      description:
        "Get access to PSD files for 2D mockups to tweak, edit, and make your own detailed changes. Get commercial license to download and use PSD templates. Available in enterprise plan.",
    },
    {
      icon: <MonitorSmartphone />,
      title: "High quality downloads",
      description:
        "Set custom resolution while downloading your mockups and AI generated images. It allows more control over the resolution of the image output.",
    },
    {
      icon: <Headset />,
      title: "Priority Support",
      description:
        "[Only available in enterprise plan] Get dedicated manager and 24/7 priority support as we execute custom tailored solutions for your brand and team.",
    },
  ];
  
  export default function PremiumPage() {
    return (
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-start">
          <h2 className="text-4xl md:text-3xl font-bold text-black">
            Experience Mockey AI Magic With Premium Plans
          </h2>
          <p className="mt-4 text-gray-700 max-w-3xl text-md md:text-base">
            Our Pro and Enterprise plans are crafted to cater to all your mockup and
            photography needs. Learn more about what we offer in our premium plans.
          </p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left">
            {features.map((item, index) => (
              <div key={index} className="flex flex-col items-start gap-4">
                <div className="bg-pink-100 text-pink-600 p-2 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-base text-black">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
  
          <div className="mt-12 flex items-center justify-center text-sm text-gray-600">
            <img src="/download.svg" alt="Download Icon" className="w-5 h-5 mr-2" />
            <span>
              Support Mockey AI team – Even a 1-time monthly subscription will help Mockey
              team keep up the good work of giving out 1000s of high quality mockups for free.
            </span>
          </div>
        </div>
      </div>
    );
  }
