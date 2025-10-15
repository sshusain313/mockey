export default function CreditsPage() {
    const credits = [
      { operation: "AI Background Blur", cost: "2 Credits" },
      { operation: "AI Background Remove", cost: "2 Credits" },
      { operation: "AI Background Generate", cost: "2 Credits" },
      { operation: "AI Image Upscale", cost: "1 - 6 Credits" },
      { operation: "AI Image Resize", cost: "2 Credits" },
      { operation: "AI Animate", cost: "10 Credits" },
    ];
  
    return (
      <div className=" bg-white px-4 sm:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credits usage</h1>
          <p className="text-gray-500 mb-8">
            Each AI operation has some credit associated to it. The following table summarises the cost of each operation
          </p>
  
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 font-semibold text-gray-700 px-6 py-4 border-b border-gray-200">
              <div>AI Operation</div>
              <div>Credit Cost</div>
            </div>
            {credits.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 px-6 py-3 text-gray-800 border-b last:border-none border-gray-200 text-sm sm:text-base"
              >
                <div>{item.operation}</div>
                <div>{item.cost}</div>
              </div>
            ))}
          </div>
  
          <p className="text-xs text-gray-500 mt-4">
            *All AI generations will be stored for 24 hours, after which they will be removed from our server.
          </p>
        </div>
      </div>
    );
  }
  
