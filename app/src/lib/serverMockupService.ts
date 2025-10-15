// // This service handles server-side storage for mockups and designs
// import { MockupItem } from './mockupService';
// import { getSession } from 'next-auth/react';

// // API endpoints
// const MOCKUPS_API_ENDPOINT = '/api/mockups';
// const DESIGNS_API_ENDPOINT = '/api/designs';

// /**
//  * Fetch a mockup by ID from the server
//  */
// export async function fetchMockupById(mockupId: number | string): Promise<MockupItem | null> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {};
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     const response = await fetch(`${MOCKUPS_API_ENDPOINT}/${mockupId}`, { headers });
//     if (!response.ok) {
//       throw new Error(`Failed to fetch mockup: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching mockup with ID ${mockupId}:`, error);
//     // Fallback to local storage if server request fails
//     return getLocalMockupById(mockupId);
//   }
// }

// /**
//  * Fetch all mockups from the server
//  */
// export async function fetchAllMockups(): Promise<MockupItem[]> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {};
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     const response = await fetch(MOCKUPS_API_ENDPOINT, { headers });
//     if (!response.ok) {
//       throw new Error(`Failed to fetch mockups: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching mockups:', error);
//     // Fallback to local storage if server request fails
//     return getLocalMockups();
//   }
// }

// /**
//  * Save a mockup to the server
//  */
// export async function saveMockupToServer(mockup: MockupItem): Promise<MockupItem> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//     };
    
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     const response = await fetch(MOCKUPS_API_ENDPOINT, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(mockup),
//     });
    
//     if (!response.ok) {
//       throw new Error(`Failed to save mockup: ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error saving mockup to server:', error);
//     // Fallback to local storage
//     saveLocalMockup(mockup);
//     return mockup;
//   }
// }

// /**
//  * Update all mockups on the server
//  */
// export async function updateAllMockups(mockups: MockupItem[]): Promise<MockupItem[]> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//     };
    
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     const response = await fetch(MOCKUPS_API_ENDPOINT, {
//       method: 'PUT',
//       headers,
//       body: JSON.stringify(mockups),
//     });
    
//     if (!response.ok) {
//       throw new Error(`Failed to update mockups: ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating mockups on server:', error);
//     // Fallback to local storage
//     saveLocalMockups(mockups);
//     return mockups;
//   }
// }

// /**
//  * Delete a mockup from the server
//  */
// export async function deleteMockupFromServer(mockupId: number | string) {
//   try {
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {};
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     const response = await fetch(`${MOCKUPS_API_ENDPOINT}/${mockupId}`, {
//       method: 'DELETE',
//       headers
//     });
    
//     if (!response.ok) {
//       throw new Error(`Failed to delete mockup: ${response.statusText}`);
//     }
//   } catch (error) {
//     console.error('Error deleting mockup from server:', error);
//     // Fallback to local storage
//     deleteLocalMockup(mockupId);
//   }
// }

// /**
//  * Clears all product data from the database and mockup items
//  * @returns Promise with success status and message
//  */
// export async function clearAllProductData(): Promise<{ success: boolean, message: string }> {
//   try {
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json'
//     };
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     // Clear all products from the database
//     const productsResponse = await fetch('/api/products', {
//       method: 'DELETE',
//       headers
//     });
    
//     if (!productsResponse.ok) {
//       throw new Error(`Failed to clear products: ${productsResponse.statusText}`);
//     }
    
//     // Clear all mockups from the database
//     const mockupsResponse = await fetch(`${MOCKUPS_API_ENDPOINT}`, {
//       method: 'DELETE',
//       headers
//     });
    
//     if (!mockupsResponse.ok) {
//       throw new Error(`Failed to clear mockups: ${mockupsResponse.statusText}`);
//     }
    
//     // Also clear local storage
//     localStorage.removeItem('mockupItems');
//     localStorage.removeItem('localProducts');
//     localStorage.removeItem('lastMockupId');
    
//     return { success: true, message: 'All product data and mockups have been cleared' };
//   } catch (error) {
//     console.error('Error clearing all product data:', error);
//     throw error;
//   }
// }

// /**
//  * Clear all user-uploaded mockups
//  */
// export async function clearUserUploadedMockups(): Promise<void> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // Add authentication headers if user is logged in
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//     };
    
//     if (session) {
//       headers['Authorization'] = `Bearer ${session.user.id}`;
//     }
    
//     // Fetch default mockups (we'll assume these have IDs < 100)
//     const allMockups = await fetchAllMockups();
//     const defaultMockups = allMockups.filter(mockup => mockup.id < 100);
    
//     // Update server with only default mockups
//     await updateAllMockups(defaultMockups);
//   } catch (error) {
//     console.error('Error clearing user-uploaded mockups:', error);
//     // Fallback to local storage
//     localStorage.removeItem('mockupItems');
//     localStorage.removeItem('lastMockupId');
//   }
// }

// /**
//  * Save a design to the server
//  */
// export async function saveDesignToServer(designImage: string, productType: string = 'tshirt'): Promise<string> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // If user is not logged in, save to local storage and return
//     if (!session) {
//       localStorage.setItem('userUploadedDesign', designImage);
//       return designImage;
//     }
    
//     const response = await fetch(DESIGNS_API_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         designImage,
//         productType,
//         productCategory: 'Apparel'
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error(`Failed to save design: ${response.statusText}`);
//     }
    
//     const data = await response.json();
//     return data.designUrl || designImage;
//   } catch (error) {
//     console.error('Error saving design to server:', error);
//     // Fallback to local storage
//     localStorage.setItem('userUploadedDesign', designImage);
//     return designImage;
//   }
// }

// /**
//  * Get the current uploaded design
//  */
// export async function getCurrentDesign(): Promise<string | null> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // If user is not logged in, get from local storage
//     if (!session) {
//       return localStorage.getItem('userUploadedDesign');
//     }
    
//     const response = await fetch(`${DESIGNS_API_ENDPOINT}?productType=tshirt&productCategory=Apparel`);
    
//     if (!response.ok) {
//       throw new Error(`Failed to fetch designs: ${response.statusText}`);
//     }
    
//     const data = await response.json();
    
//     // Return the most recent design if available
//     if (data.designs && data.designs.length > 0) {
//       return data.designs[0].designImage;
//     }
    
//     return null;
//   } catch (error) {
//     console.error('Error fetching current design:', error);
//     // Fallback to local storage
//     return localStorage.getItem('userUploadedDesign');
//   }
// }

// // Local storage fallback functions
// function getLocalMockups(): MockupItem[] {
//   const mockupsJson = localStorage.getItem('mockupItems');
//   return mockupsJson ? JSON.parse(mockupsJson) : [];
// }

// function getLocalMockupById(mockupId: number | string): MockupItem | null {
//   const mockups = getLocalMockups();
//   const id = typeof mockupId === 'string' ? parseInt(mockupId) : mockupId;
//   return mockups.find(mockup => mockup.id === id) || null;
// }

// function saveLocalMockup(mockup: MockupItem): void {
//   const mockups = getLocalMockups();
//   mockups.unshift(mockup);
//   localStorage.setItem('mockupItems', JSON.stringify(mockups));
// }

// function saveLocalMockups(mockups: MockupItem[]): void {
//   localStorage.setItem('mockupItems', JSON.stringify(mockups));
// }

// function deleteLocalMockup(mockupId: number): void {
//   const mockups = getLocalMockups();
//   const updatedMockups = mockups.filter(mockup => mockup.id !== mockupId);
//   localStorage.setItem('mockupItems', JSON.stringify(updatedMockups));
// }

// /**
//  * Initialize the server mockup service
//  * This will sync local mockups to the server if they don't exist there
//  */
// export async function initServerMockupService(): Promise<void> {
//   try {
//     // Get the user session
//     const session = await getSession();
    
//     // Check if we have mockups on the server
//     const serverMockups = await fetchAllMockups();
    
//     if (serverMockups.length === 0) {
//       // If no server mockups, get local mockups and upload them
//       const localMockups = getLocalMockups();
      
//       if (localMockups.length > 0) {
//         await updateAllMockups(localMockups);
//       }
//     }
    
//     // Check for current design in local storage
//     const localDesign = localStorage.getItem('userUploadedDesign');
//     if (localDesign && session) {
//       // Upload to server if user is logged in
//       await saveDesignToServer(localDesign);
//       // Clear from local storage after successful upload
//       localStorage.removeItem('userUploadedDesign');
//     }
//   } catch (error) {
//     console.error('Error initializing server mockup service:', error);
//   }
// }
