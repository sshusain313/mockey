const mockupItems = [
  { label: "T-shirt", src: "/mockups/tshirt.jpg", link: "/apparel/tshirt" },
  { label: "Hoodie", src: "/mockups/hoodie.jpg", link: "/apparel/hoodie" },
  { label: "Totebag", src: "/mockups/totebag.jpg", link: "/accessories/totebag" },
  { label: "Box", src: "/mockups/box.jpg", link: "/packaging/box" },
  { label: "Poster", src: "/mockups/poster.jpg", link: "/prints/poster" },
  { label: "iPhone", src: "/mockups/iphone.jpg", link: "/electronics/iphone" },
  { label: "Book", src: "/mockups/book.jpg", link: "/stationery/book" },
  { label: "Business Card", src: "/mockups/business-card.jpg", link: "/stationery/business-card" },
];
{/* <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto"></div> */}
export default function Grid() {
  return (
    <div className="px-4 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {mockupItems.map(({ label, src, link }) => (
          <a
            key={label}
            href={link}
            className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer"
          >
            <img
              src={src}
              alt={label}
              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-2 left-2 text-[30px] leading-[60px] font-bold text-white tracking-normal drop-shadow-md">
              {label}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
