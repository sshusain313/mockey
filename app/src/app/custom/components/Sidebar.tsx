// 'use client';

// import { Pencil, FileEdit } from 'lucide-react';
// import { useState } from 'react';
// import clsx from 'clsx';

// const menuItems = [
//   { label: 'Edit', icon: <Pencil className="h-5 w-5" /> },
//   { label: 'Mockup', icon: <FileEdit className="h-5 w-5 text-pink-500" />, active: true },
// ];

// export default function Sidebar() {
//   const [activeIndex, setActiveIndex] = useState(1);

//   interface SidebarChangeEventDetail {
//     tab: 'edit' | 'mockup';
//   }

//   const handleClick = (index: number): void => {
//     setActiveIndex(index);
//     // Emit the active tab type
//     window.dispatchEvent(
//       new CustomEvent<SidebarChangeEventDetail>('sidebarChange', {
//         detail: { tab: index === 0 ? 'edit' : 'mockup' },
//       })
//     );
//   };

//   return (
//     <aside className="w-20 bg-white h-screen flex flex-col items-center py-6">
//       {menuItems.map((item, index) => (
//         <button
//           key={index}
//           className={clsx(
//             'flex flex-col items-center text-xs font-medium py-3 w-full',
//             activeIndex === index && 'text-pink-500'
//           )}
//           onClick={() => handleClick(index)}
//         >
//           <div
//             className={clsx(
//               'p-2 rounded-md',
//               activeIndex === index && 'bg-pink-100'
//             )}
//           >
//             {item.icon}
//           </div>
//           <span className={clsx(activeIndex === index ? 'mt-1' : 'mt-2 text-black')}>
//             {item.label}
//           </span>
//         </button>
//       ))}
//     </aside>
//   );
// }

