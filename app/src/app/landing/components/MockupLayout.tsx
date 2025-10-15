import { MockupHero } from "./MockupHero";

export const MockupGrid = () => {
  return <div>Mockup Grid Content</div>;
};

export function MockupLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <MockupHero />
        <div className="mt-16 max-w-xl">
          <h2 className="text-2xl font-bold mb-6">Apparel</h2>
          <MockupGrid />
        </div>
      </div>
    </div>
  );
}
