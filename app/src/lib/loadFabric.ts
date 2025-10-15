'use client';

let fabricPromise: Promise<any> | null = null;

export function loadFabric(): Promise<any> {
  if (fabricPromise) {
    return fabricPromise;
  }

  fabricPromise = new Promise((resolve, reject) => {
    // Check if fabric is already loaded
    if (typeof window !== 'undefined' && (window as any).fabric) {
      resolve((window as any).fabric);
      return;
    }

    // Load fabric.js script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).fabric) {
        console.log('Fabric.js loaded successfully');
        resolve((window as any).fabric);
      } else {
        reject(new Error('Failed to load Fabric.js'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Fabric.js script'));
    };

    document.body.appendChild(script);
  });

  return fabricPromise;
}

export default loadFabric;