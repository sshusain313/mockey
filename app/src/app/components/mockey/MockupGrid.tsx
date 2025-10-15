
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MockupCardProps {
  title: string;
  description: string;
  bgColor: string;
  accentColor: string;
  icon: React.ReactNode;
}

function MockupCard({ title, description, bgColor, accentColor, icon }: MockupCardProps) {
  return (
    <Card className={`overflow-hidden border-0 shadow-sm ${bgColor} relative`}>
      <CardContent className="p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium">Mockey for</span>
          <div className={`h-1 w-8 ${accentColor}`}></div>
        </div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-sm mb-10 opacity-90 max-w-xs">{description}</p>
        
        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        
        {/* Decorative circles on the right edge */}
        <div className={`absolute right-0 top-1/4 h-12 w-6 ${accentColor} rounded-l-full`}></div>
        <div className={`absolute right-0 top-2/4 h-12 w-6 ${accentColor} rounded-l-full`}></div>
        {title === "Designers & Creators" && (
          <div className={`absolute right-0 bottom-1/4 h-12 w-6 ${accentColor} rounded-l-full`}></div>
        )}
      </CardContent>
    </Card>
  );
}

export function MockupGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* E-commerce card */}
      <MockupCard 
        title="E-commerce" 
        description="Generate high-quality professional looking product mockups for your e-commerce store or D2C brand." 
        bgColor="bg-pink-200"
        accentColor="bg-red-500"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff3b57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
        }
      />
      
      {/* Designers & Creators card */}
      <MockupCard 
        title="Designers & Creators" 
        description="Mock-up templates are ideal to showcase your design directly on the appropriate products. Drag & adjust your designs to generate stunning results." 
        bgColor="bg-yellow-100"
        accentColor="bg-yellow-400"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v18H3z"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
        }
      />
      
      {/* Social Media card */}
      <MockupCard 
        title="Social Media" 
        description="Improve your content game with premium and free mockups. Get original biggest source of photo-realistic free PSD Mockups online." 
        bgColor="bg-purple-100"
        accentColor="bg-purple-500"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <path d="M7 9h.01"/> 
            <path d="m10 13 1-1 2 2 4-4"/>
          </svg>
        }
      />
      
      {/* Print-on-Demand card */}
      <MockupCard 
        title="Print-on-Demand" 
        description="With free AI mockup generator, Create stunning product photos easily and online for your print-on-demand business." 
        bgColor="bg-green-100"
        accentColor="bg-green-400"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2v12a2 2 0 0 0 2 2h10"/>
            <path d="M18 14v8"/>
            <path d="M18 22H4a2 2 0 0 1-2-2V6"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
          </svg>
        }
      />
    </div>
  );
}


