export function MockupHeader() {
  return <header>Mockup Header</header>;
}

import { MockupGrid } from "./MockupGrid";

export function MockupLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <MockupHeader />
        <MockupGrid />
      </div>
    </div>
  );
}
