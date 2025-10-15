import { Card, CardContent } from "@/components/ui/card";

interface ApparelCardProps {
  title: string;
  count: string;
  bgColor: string;
  imageSrc: string;
}

function ApparelCard({ title, count, bgColor, imageSrc }: ApparelCardProps) {
  return (
    <Card className={`w-1/2 mx-auto overflow-hidden border-0 shadow-sm ${bgColor} h-full`}>
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm opacity-80 mt-1">{count} mockups</p>
          </div>
          <div className="w-24 h-24">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MockupGrid() {
  const apparelItems = [
    {
      title: "T-Shirt",
      count: "805+",
      bgColor: "bg-pink-100",
      imageSrc: "/placeholder.svg"
    },
    {
      title: "Tank Top",
      count: "47+",
      bgColor: "bg-blue-100",
      imageSrc: "/placeholder.svg"
    },
    {
      title: "Hoodie",
      count: "123+",
      bgColor: "bg-purple-100",
      imageSrc: "/placeholder.svg"
    },
    {
      title: "Sweatshirt",
      count: "95+",
      bgColor: "bg-green-100",
      imageSrc: "/placeholder.svg"
    },
    {
      title: "Jacket",
      count: "72+",
      bgColor: "bg-yellow-100",
      imageSrc: "/placeholder.svg"
    },
    {
      title: "Crop Top",
      count: "61+",
      bgColor: "bg-orange-100",
      imageSrc: "/placeholder.svg"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {apparelItems.map((item, index) => (
        <ApparelCard
          key={index}
          title={item.title}
          count={item.count}
          bgColor={item.bgColor}
          imageSrc={item.imageSrc}
        />
      ))}
    </div>
  );
}
