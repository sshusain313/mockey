'use client';

// Removed next/head; use route metadata instead.
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Search, LogIn, LogOut, User, Menu, X } from 'react-feather';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function TShirtGallery() {
  const mockups = [
    {
      id: 1,
      title: "White Acid Wash Tshirt Mockup Male Model Hand In Pocket",
      image: "/appearl/model-1001.webp",
    },
    {
      id: 2,
      title: "Flat Lay White Boxy Tshirt Mockup On Carpeted Floor",
      image: "/appearl/model-1002.webp",
    },
    {
      id: 3,
      title: "Back View White Tshirt Mockup Female Model With Straight Black Hair",
      image: "/appearl/model-1003.webp",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {mockups.map((mockup) => (
        <Link href="/editor" key={mockup.id}>
          <a>
            <Image
              src={mockup.image}
              alt={mockup.title}
              width={300}
              height={300}
              className="rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </a>
        </Link>
      ))}
    </div>
  );
}

function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const router = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <button className="bg-gray-200 text-gray-500 font-semibold text-sm px-5 py-2 rounded-md cursor-wait">
        Loading...
      </button>
    );
  }

  if (session && session.user) {
    return (
      <div className="flex items-center gap-2 relative">
        <div 
          className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 cursor-pointer"
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        >
          {session.user.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              width={32} 
              height={32} 
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={16} />
            </div>
          )}
          <span className="text-sm font-medium">
            {session.user.name ? session.user.name.split(' ')[0] : 'User'}
          </span>
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-90' : ''}`}
          />
        </div>
        
        {/* User dropdown menu */}
        {userDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            {/* Admin Dashboard link - only for admin users */}
            {session.user.role === 'admin' && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    <span>Admin Dashboard</span>
                  </div>
                </Link>
                <Link 
                  href="/admin/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-purple-600" />
                    <span>Profile</span>
                  </div>
                </Link>
              </>
            )}
            
            {/* Profile link */}
            {/* <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setUserDropdownOpen(false)}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </div>
            </Link> */}
            
            {/* Logout button */}
            <button 
              onClick={() => {
                setUserDropdownOpen(false);
                signOut({ callbackUrl: '/', redirect: true });
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                <span>Logout</span>
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => router.push('/auth/signin')}
        className="bg-black text-white font-semibold text-sm px-5 py-2 rounded-md hover:opacity-90 flex items-center gap-2"
      >
        <LogIn size={16} />
        Login
      </button>
      <button 
        onClick={() => router.push('/auth/signup')}
        className="border border-black text-black font-semibold text-sm px-5 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
      >
        <User size={16} />
        Sign Up
      </button>
    </div>
  );
}

export default function NavbarPage() {
  const { data: session } = useSession();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'mockups' | 'tools' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Check if we're on mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is typically lg breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      // Add event listener for escape key
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling on body when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling when mobile menu is closed
      document.body.style.overflow = '';
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menu: 'mockups' | 'tools') => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 2500);
  };

  const handleClick = (menu: 'mockups' | 'tools') => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <>
      {/* Title handled via app/ route metadata */}
      <nav
        className={`sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-4 bg-white shadow-sm backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'bg-opacity-80' : 'bg-opacity-100'
        }`}
      >
        {/* Left side: Logo + Nav */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="text-green-500 text-3xl italic font-extrabold tracking-tight font-[cursive]">
            <Link href='/'><Image src="/shelfmerch.png" alt="shelf merch" width={125} height={60} /></Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-500 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links - Hidden on mobile, visible on desktop */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-black">
            {/* Products Gallery - only visible to admin users */}
            {session && session.user && session.user.role === 'admin' && (
              <li>
                <Link prefetch={false} href="/admin/products" className="hover:text-gray-700">
                  Product Gallery
                </Link>
              </li>
            )}
            {/* Mockups */}
            <li
              className="relative cursor-pointer flex items-center justify-between"
              onMouseEnter={() => handleMouseEnter('mockups')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('mockups')}
            >
              <span className="flex text-sm font-medium items-center">
                Mockups
                <ChevronRight
                  size={12}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === 'mockups' ? 'rotate-90' : ''
                  }`}
                />
              </span>

              {activeDropdown === 'mockups' && (
                <div
                  className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-md z-50 flex p-4 transition-all duration-300 ${
                    openSection === 'print'
                      ? 'w-[500px]'
                      : openSection === 'apparel'
                      ? 'w-[350px]'
                      : 'w-[300px]'
                  }`}
                  onMouseEnter={() => handleMouseEnter('mockups')}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Visual */}
                  {/* <div className="w-[150px] pr-3 border-r border-gray-200">
                    <Image
                      src="/mocknav.webp"
                      alt="Mockup Promo"
                      width={140}
                      height={180}
                      className="rounded-md object-cover"
                    />
                  </div> */}

                  {/* Dropdown Content */}
                  <div className="flex-1 grid grid-cols-2 gap-4 pl-3 text-sm">
                    {/* Column 1 */}
                    <div className="space-y-2">
                      {['apparel', 'accessories', 'home', 'print', 'packaging', 'tech', 'jewelry'].map(
                        (item) => (
                          <h4
                            key={item}
                            className="cursor-pointer font-semibold text-black flex items-center justify-between"
                            onClick={() => setOpenSection(openSection === item ? null : item)}
                          >
                            {item.charAt(0).toUpperCase() + item.slice(1).replace('&', '& ')}
                            <ChevronRight
                              size={18}
                              className={`transition-transform duration-200 ${
                                openSection === item ? 'rotate-90' : ''
                              }`}
                            />
                          </h4>
                        )
                      )}
                    </div>

                    {/* Column 2 */}
                    <div>
                      {openSection === 'apparel' && (
                        <ul className="space-y-2 text-gray-700 grid grid-cols-2 gap-x-2 gap-y-1">
                          <li>
                            <Link href="/apparel/tshirt">T-Shirt</Link>
                          </li>
                          <li>
                            <Link href="/apparel/tanktop">Tank Top</Link>
                          </li>
                          <li>
                            <Link href="/apparel/hoodie">Hoodie</Link>
                          </li>
                          <li>
                            <Link href="/apparel/sweatshirt">Sweatshirt</Link>
                          </li>
                          <li>
                            <Link href="/apparel/jacket">Jacket</Link>
                          </li>
                          <li>
                            <Link href="/apparel/croptop">Crop Top</Link>
                          </li>
                          <li>
                            <Link href="/apparel/apron">Apron</Link>
                          </li>
                          <li>
                            <Link href="/apparel/scarf">Scarf</Link>
                          </li>
                          <li>
                            <Link href="/apparel/jersey">Jersey</Link>
                          </li>
                        </ul>
                      )}
                       {openSection === 'accessories' && (
                        <ul className="space-y-2 text-gray-700">
                          <li>
                            <Link href="/accessories/totebag">Tote Bag</Link>
                          </li>
                          <li>
                            <Link href="/accessories/cap">Cap</Link>
                          </li>
                          <li>
                            <Link href="/accessories/phone-cover">Phone Cover</Link>
                          </li>
                          <li>
                            <Link href="/accessories/gaming-pad">Gaming Pad</Link>
                          </li>
                          <li>
                            <Link href="/accessories/beanie">Beanie</Link>
                          </li>
                        </ul>
                      )}
                       {openSection === 'home' && (
                        <ul className="space-y-2 text-gray-700">
                          <li>
                            <Link href="/home-living/can">Can</Link>
                          </li>
                          <li>
                            <Link href="/home-living/mug">Mug</Link>
                          </li>
                          <li>
                            <Link href="/home-living/cusion">Cushion</Link>
                          </li>
                          <li>
                            <Link href="/home-living/frame">Frame</Link>
                          </li>
                          <li>
                            <Link href="/home-living/coaster">Coaster</Link>
                          </li>
                        </ul>
                      )}
                       {openSection === 'print' && (
                        <ul className="space-y-2 text-gray-700 grid grid-cols-2 gap-2">
  
<li>
  <Link href="/print/business-card">Business Card</Link>
</li>
<li>
  <Link href="/print/book">Book</Link>
</li>
<li>
  <Link href="/print/id-card">ID Card</Link>
</li>
<li>
  <Link href="/print/sticker">Sticker</Link>
</li>
<li>
  <Link href="/print/poster">Poster</Link>
</li>
<li>
  <Link href="/print/flyer">Flyer</Link>
</li>
<li>
  <Link href="/print/greeting">Greeting Card</Link>
</li>
<li>
  <Link href="/print/billboard">Billboard</Link>
</li>
<li>
  <Link href="/print/magazine">Magazine</Link>
</li>
<li>
  <Link href="/print/brochure">Brochure</Link>
</li>
<li>
  <Link href="/print/lanyard">Lanyard</Link>
</li>
<li>
  <Link href="/print/banner">Banner</Link>
</li>
<li>
  <Link href="/print/canvas">Canvas</Link>
</li>
<li>
  <Link href="/print/notebook">Notebook</Link>
</li>
                        </ul>
                      )}
                       {openSection === 'packaging' && (
                        <ul className="space-y-2 text-gray-700">
                          <li>
                            <Link href="/packaging/box">Box</Link>
                          </li>
                          <li>
                            <Link href="/packaging/tube">Tube</Link>
                          </li>
                          <li>
                            <Link href="/packaging/dropper-bottle">Dropper Bottle</Link>
                          </li>
                          <li>
                            <Link href="/home-living/pouch">Pouch</Link>
                          </li>
                          <li>
                            <Link href="/home-living/cosmetic">Cosmetic</Link>
                          </li>
                          <li>
                            <Link href="/packaging/bottle">Bottle</Link>
                          </li>
                        </ul>
                      )}
                       {openSection === 'tech' && (
                        <ul className="space-y-2 text-gray-700">
                          <li>
                            <Link href="/tech/iphone">IPhone</Link>
                          </li>
                          <li>
                            <Link href="/tech/laptop">Lap Top</Link>
                          </li>
                          <li>
                            <Link href="/tech/ipad">IPad</Link>
                          </li>
                          <li>
                            <Link href="/tech/macbook">Macbook</Link>
                          </li>
                          <li>
                            <Link href="/tech/phone">Phone</Link>
                          </li>
                        </ul>
                      )}
                       {openSection === 'jewelry' && (
                        <ul className="space-y-2 text-gray-700">
                          <li>
                            <Link href="/jewelry/ring">Ring</Link>
                          </li>
                          <li>
                            <Link href="/jewelry/necklace">Necklace</Link>
                          </li>
                          <li>
                            <Link href="/jewelry/earring">Earring</Link>
                          </li>
                          
                        </ul>
                      )}
                      {/* Add other sections here */}
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* Tools */}
            <li
              className="relative flex text-sm font-medium cursor-pointer hover:text-gray-700"
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('tools')}
            >
              Tools
              <span className="text-white ml-1 text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full">
                coming soon
              </span>
              {/* Tools <span className="ml-1">
                <ChevronRight
                  size={12}
                  className={`ml-1 mt-1 transition-transform duration-200 ${
                    activeDropdown === 'tools' ? 'rotate-90' : ''
                  }`}
                />
              </span>

              {activeDropdown === 'tools' && (
                <div
                  className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-md transition-all duration-300 w-auto min-w-[600px] z-50`}
                  onMouseEnter={() => handleMouseEnter('tools')}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex">
 
                    <div className="w-[180px] p-4 border-r border-gray-200">
                      <Image
                        src="/tools.png"
                        alt="Tools Promo"
                        width={140}
                        height={180}
                        className="rounded-md object-cover mb-4"
                      />
                    </div>

                    <div className="flex flex-row p-4 relative">
                      <div className="flex flex-col space-x-8 items-start justify-around">
                        <div
                          className={`flex items-center cursor-pointer ${
                            openSection === 'image-editing' ? 'text-gray-700' : 'hover:text-gray-900'
                          }`}
                          onClick={() =>
                            setOpenSection(openSection === 'image-editing' ? null : 'image-editing')
                          }
                        >
                          <span className="font-medium">Image Editing</span>
                          <ChevronRight
                            size={16}
                            className={`ml-1 transition-transform ${
                              openSection === 'image-editing' ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`flex items-center cursor-pointer ${
                            openSection === 'ai-tools' ? 'text-gray-700' : 'hover:text-gray-900'
                          }`}
                          onClick={() =>
                            setOpenSection(openSection === 'ai-tools' ? null : 'ai-tools')
                          }
                        >
                          <span className="font-medium">AI Tools</span>
                          <ChevronRight
                            size={16}
                            className={`ml-1 transition-transform ${
                              openSection === 'ai-tools' ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                        <div
                          className={`flex items-center cursor-pointer ${
                            openSection === 'image-converter'
                              ? 'text-gray-700'
                              : 'hover:text-gray-900'
                          }`}
                          onClick={() =>
                            setOpenSection(
                              openSection === 'image-converter' ? null : 'image-converter'
                            )
                          }
                        >
                          <span className="font-medium">Image Converter</span>
                          <ChevronRight
                            size={16}
                            className={`ml-1 transition-transform ${
                              openSection === 'image-converter' ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col pt-4">
                        {openSection === 'image-editing' && (
                          <div className="flex flex-col gap-3">
                            <Link href="#" className="">Image background</Link>
                            <Link href="#" className="">Outfits AI</Link>
                            <Link href="#" className="">Blur Background</Link>
                          </div>
                        )}

                        {openSection === 'ai-tools' && (
                          <div className="flex flex-col gap-3">
                            <Link href="#" className="">AI Photography</Link>
                            <Link href="#" className="">AI Image Generator</Link>
                          </div>
                        )}

                        {openSection === 'image-converter' && (
                          <div className="grid grid-cols-2 gap-3">
                            <Link href="#" className="">PNG to WebP</Link>
                            <Link href="#" className="">WebP to PNG</Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            </li>

            {/* Static Links */}
            <li className="cursor-pointer flex items-center gap-1 hover:text-green-500">
              <Link prefetch={false} href='/3d'>3D Mockup</Link>
              <span className="text-white text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full">coming soon</span>
            </li>
            <li className="cursor-pointer flex items-center gap-1 hover:text-green-500">
              <Link prefetch={false} href='/custom'>Custom Mockup</Link>
              {/* <span className="text-white text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full">NEW</span> */}
            </li>
            <li className="cursor-pointer flex items-center gap-1 hover:text-green-500">
              <Link prefetch={false} href='/vide-mockup'>Video Mockup</Link>
              <span className="text-white text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full">coming soon</span>
            </li>
            <li className="cursor-pointer hover:text-green-500"><Link prefetch={false} href='/pricing'>Pricing</Link></li>
          </ul>
        </div>

        {/* Right side: Search Bar and Auth Button */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div 
            className="hidden md:flex relative items-center w-64 border border-gray-300 rounded-md hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => {
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }, 100);
            }}
          >
            <div className="absolute left-3 text-gray-400">
              <Search size={16} />
            </div>
            <div className="w-full py-2 pl-9 pr-12 text-sm text-gray-500 rounded-md">
              Search Mockups
            </div>
            <div className="absolute right-3 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              Ctrl K
            </div>
          </div>

          {/* Auth Button */}
          <AuthButton />
        </div>
      </nav>

      {/* Mobile Menu - Slide in from left */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop - close when clicked */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 flex justify-end p-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Close button in the backdrop */}
            <button 
              className="text-white p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(false);
              }}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Menu Panel with slide-in animation */}
          <div className="absolute top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out animate-slide-in">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="text-green-500 text-xl font-bold">
                <Link href='/' onClick={() => setIsMobileMenuOpen(false)}>
                  <Image src="/shelf.png" alt="Mockey" width={80} height={32} />
                </Link>
              </div>
              <button 
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Menu Content */}
            <div className="p-4">
              {/* Mobile Search */}
              <div 
                className="flex items-center w-full border border-gray-300 rounded-md mb-6"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <div className="p-2 text-gray-400">
                  <Search size={18} />
                </div>
                <div className="flex-1 py-2 text-sm text-gray-500">
                  Search Mockups
                </div>
              </div>
              
              {/* Mobile Navigation Links */}
              <ul className="space-y-4">
                {/* Products Gallery - only visible to admin users */}
                {session && session.user && session.user.role === 'admin' && (
                  <li className="py-2 border-b border-gray-100">
                    <Link 
                      prefetch={false}
                      href="/product-gallery" 
                      className="block text-gray-800 hover:text-green-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Product Gallery
                    </Link>
                  </li>
                )}
                
                {/* Mockups Dropdown */}
                <li className="py-2 border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between text-gray-800"
                    onClick={() => setOpenSection(openSection === 'mobile-mockups' ? null : 'mobile-mockups')}
                  >
                    <span>Mockups</span>
                    <ChevronRight
                      size={18}
                      className={`transition-transform duration-200 ${
                        openSection === 'mobile-mockups' ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  
                  {/* Mockups Submenu */}
                  {openSection === 'mobile-mockups' && (
                    <div className="mt-2 ml-4 space-y-2">
                      <div 
                        className="flex items-center justify-between text-gray-700"
                        onClick={() => setOpenSection('mobile-apparel')}
                      >
                        <span>Apparel</span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            (openSection as string) === 'mobile-apparel' ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      
                      {(openSection as string) === 'mobile-apparel' && (
                        <ul className="mt-1 ml-4 space-y-2 text-gray-600">
                          <li>
                            <Link 
                              href="/apparel/tshirt" 
                              className="block hover:text-green-500"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              T-Shirt
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/apparel/tanktop" 
                              className="block hover:text-green-500"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Tank Top
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/apparel/hoodie" 
                              className="block hover:text-green-500"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Hoodie
                            </Link>
                          </li>
                        </ul>
                      )}
                      
                      <div 
                        className="flex items-center justify-between text-gray-700"
                        onClick={() => setOpenSection((openSection as string) === 'mobile-accessories' ? null : 'mobile-accessories')}
                      >
                        <span>Accessories</span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            (openSection as string) === 'mobile-accessories' ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                      
                      {(openSection as string) === 'mobile-accessories' && (
                        <ul className="mt-1 ml-4 space-y-2 text-gray-600">
                          <li>
                            <Link 
                              href="/accessories/totebag" 
                              className="block hover:text-green-500"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Tote Bag
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/accessories/cap" 
                              className="block hover:text-green-500"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Cap
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/accessories/phone-cover" 
                              className="block hover:text-green-500"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Phone Cover
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </li>
                
                {/* Static Links */}
                <li className="py-2 border-b border-gray-100">
                  <Link 
                    href="/3d" 
                    className="block text-gray-800 hover:text-green-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    3D Mockup
                  </Link>
                </li>
                <li className="py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/custom" 
                      className="block text-gray-800 hover:text-green-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Custom Mockup
                    </Link>
                    <span className="text-white text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  </div>
                </li>
                <li className="py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/vide-mockup" 
                      className="block text-gray-800 hover:text-green-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Video Mockup
                    </Link>
                    <span className="text-white text-xs font-semibold bg-green-500 px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  </div>
                </li>
                <li className="py-2 border-b border-gray-100">
                  <Link 
                    href="/pricing" 
                    className="block text-gray-800 hover:text-green-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs z-50 flex items-start justify-center pt-[10vh]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            {/* Search Input */}
            <div className="relative border-b border-gray-200">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Mockups"
                className="w-full py-4 pl-12 pr-12 text-lg focus:outline-none"
                autoFocus
              />
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setIsSearchOpen(false)}
              >
                <span className="text-2xl font-light">×</span>
              </button>
            </div>
            
            {/* Suggestions */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Suggestions</h3>
              <ul className="space-y-1">
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Tshirt Mockup</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Oversized Tshirt Mockup</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Tote Bag Mockup</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
