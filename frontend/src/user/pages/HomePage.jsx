import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Carousel from '../sections/Carousel.jsx';
import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Categories from '../sections/Categories.jsx';
import Godown from '../sections/Godown.jsx';
import Contact from '../sections/Contact.jsx';
import { useData } from '../../data/DataContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowRightCircle, Sprout, Droplets, Leaf, Flower2, User, Search, MapPin } from 'lucide-react';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const FeaturedProducts = () => {
  const { products, getImageUrl } = useData();
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section id="products" className="relative py-12 bg-[#F9FBF9] overflow-hidden leading-snug">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-10 text-center">
          <span className="text-green-700 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Top Quality</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2A3324] font-inter">
            Featured Products
          </h2>
        </div>

        <div className="relative group/scroll">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-30 bg-white hover:bg-green-50 text-green-900 p-3 rounded-full border border-slate-200 transition-all hidden md:flex items-center justify-center shadow-lg"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-30 bg-white hover:bg-green-50 text-green-900 p-3 rounded-full border border-slate-200 transition-all hidden md:flex items-center justify-center shadow-lg"
          >
            <ArrowRight size={20} />
          </button>

          <div 
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto no-scrollbar gap-x-4 md:gap-x-6 pb-6 scroll-smooth items-stretch"
          >
            {products.map((item) => (
              <Link 
                key={item.id} 
                to={`/products/${item._id || item.id}`}
                className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group min-w-[150px] md:min-w-[190px] max-w-[190px]"
              >
                {/* Image top half - strictly edge-to-edge square/rectangle, sharp corners */}
                <div className="h-36 md:h-44 w-full relative bg-white overflow-hidden p-2 flex items-center justify-center">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Text bottom half - centered like reference */}
                <div className="p-3 md:p-4 text-center flex flex-col flex-1 bg-white border-t border-slate-50 items-center justify-center">
                   <h3 className="text-[13px] md:text-[14px] font-bold text-[#2A3324] font-inter mb-1 line-clamp-1 uppercase tracking-tight">
                      {item.name}
                   </h3>
                   
                   <p className="text-[10px] md:text-[11px] text-slate-500 font-medium line-clamp-2 leading-tight uppercase tracking-widest opacity-60">
                      {item.subcategory || item.category || "Premium Solution"}
                   </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { products } = useData();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');

   const handleExplore = () => {
     const params = new URLSearchParams();
     if (searchQuery) params.append('search', searchQuery);
     if (categoryQuery) params.append('category_name', categoryQuery);
     
     navigate(`/products?${params.toString()}`);
   };

  useEffect(() => {
    let ticking = false;

    const updateOpacity = () => {
      if (searchContainerRef.current) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        // Start fading out when it gets within 300px of the top edge, completely hidden by 150px
        if (rect.top < 300) {
           const newOpacity = Math.max(0, (rect.top - 150) / 150);
           searchContainerRef.current.style.opacity = newOpacity;
           // Optional: disable pointer events when fully hidden so it doesn't block clicks underneath
           searchContainerRef.current.style.pointerEvents = newOpacity === 0 ? 'none' : 'auto';
        } else {
           searchContainerRef.current.style.opacity = 1;
           searchContainerRef.current.style.pointerEvents = 'auto';
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      // Use requestAnimationFrame to ensure smooth 60fps performance without freezing
      if (!ticking) {
        window.requestAnimationFrame(updateOpacity);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-0 overflow-hidden bg-[#F9FBF9]">
      {/* Hero Section with Slider - Refactored to be compact */}
      <Carousel />
      
      {/* Pill Styled Details / About Hook - Redesigned to match reference */}
      <section className="bg-[#FAF9F6] relative z-20 pb-10 md:pb-16 pt-0 mt-0">
        {/* Overlapping Pill Search Bar EXACTLY between the two divs */}
        <div 
           id="search-pill-container"
           ref={searchContainerRef}
           className="absolute left-0 right-0 top-0 -translate-y-1/2 z-30 px-4 pointer-events-none"
        >
           <div className="max-w-4xl mx-auto pointer-events-auto">
              <div className="bg-[#A4BC8E] rounded-[3rem] p-2 shadow-xl border border-white/20 flex flex-col md:flex-row items-center gap-2">
              
              {/* White Search Container */}
              <div className="flex-1 bg-white rounded-full flex flex-wrap md:flex-nowrap items-center px-4 py-2.5 w-full border border-[#91A87D]/30 shadow-sm relative overflow-hidden">
                 <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 text-[13px] placeholder-slate-400 font-medium min-w-[120px]"
                    onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                 />
                 <div className="h-5 w-px bg-slate-200 mx-3 hidden md:block"></div>
                 <input 
                    type="text" 
                    placeholder="Categories..." 
                    value={categoryQuery}
                    onChange={(e) => setCategoryQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 text-[13px] placeholder-slate-400 font-medium min-w-[120px] mb-2 md:mb-0 hidden md:block"
                    onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                 />
                 <div className="flex items-center gap-3 ml-auto">
                    <User size={16} className="text-slate-400 hover:text-green-600 cursor-pointer transition-colors" />
                    <Search size={16} className="text-slate-400 hover:text-green-600 cursor-pointer transition-colors" onClick={handleExplore} />
                    <div className="bg-green-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black pointer-events-none">
                       1
                    </div>
                 </div>
              </div>

              {/* Action Button */}
              <button 
                 onClick={handleExplore}
                 className="bg-[#3A5A38] hover:bg-[#2D472B] text-white px-6 py-2.5 rounded-full font-bold text-[13px] tracking-wide transition-all w-full md:w-auto shadow-md"
              >
                 Explore
              </button>
           </div>
           </div>
        </div>

        <Reveal>
        {/* 2-Column About layout */}
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center pt-10 md:pt-14">
           {/* Left Image Column */}
           <div className="relative mx-auto w-full max-w-[280px] md:max-w-[340px]">
              <div className="relative rounded-2xl bg-white p-2 shadow-xl rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                 <img 
                    src="/images/about_farm.png" 
                    alt="Hirato Crop Science Facility" 
                    className="w-full h-auto aspect-[4/3] object-cover rounded-xl"
                 />
                 
                 {/* Top Left Badge */}
                 <div className="absolute -left-4 md:-left-6 -top-4 md:-top-6 bg-[#3A5A38] rounded-full w-16 h-16 md:w-20 md:h-20 border-[4px] border-white shadow-lg flex flex-col items-center justify-center text-white z-10 rotate-[10deg] hover:rotate-0 transition-transform duration-300">
                    <Sprout size={20} className="mb-0.5 hidden md:block" />
                    <Sprout size={16} className="mb-0.5 md:hidden" />
                    <span className="text-[8px] md:text-[9px] font-black uppercase text-center leading-tight px-1 tracking-wider">Hirato<br/>Certified</span>
                 </div>

                 {/* Bottom Right Badge */}
                 <div className="absolute -right-3 md:-right-5 -bottom-3 md:-bottom-5 bg-[#E37A53] rounded-full w-12 h-12 md:w-14 md:h-14 border-[4px] border-white shadow-lg flex items-center justify-center text-white z-10 rotate-[-15deg] hover:rotate-0 transition-transform duration-300">
                    <Leaf size={16} className="fill-current text-[#FAF9F6] hidden md:block" />
                    <Leaf size={14} className="fill-current text-[#FAF9F6] md:hidden" />
                 </div>
              </div>
           </div>

           {/* Right Text Column */}
           <div className="space-y-3 md:pl-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-[36px] font-bold text-[#2A3324] leading-[1.15] font-inter">
                 Welcome to Hirato Crop Science!
              </h2>
              
              <p className="text-slate-500 text-xs md:text-[13px] leading-relaxed font-medium">
                 An ISO 9001:2015 certified marketing partner committed to elite fertilizers and pesticides. We empower farmers with sustainable science and high-yield solutions, bringing innovation directly to your fields.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center md:justify-start">
                 <Link to="/about" className="bg-[#3A5A38] hover:bg-[#2D472B] text-white px-5 py-2.5 rounded-full font-semibold text-xs flex items-center gap-2 transition-all shadow-md group">
                    <MapPin size={14} className="group-hover:-translate-y-1 transition-transform" />
                    Read Our Full Story
                 </Link>
                 
                 <Link to="/contact" className="text-slate-600 font-bold text-xs hover:text-[#3A5A38] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#3A5A38] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
                    Contact Us Today
                 </Link>
              </div>
           </div>
        </div>
        </Reveal>
      </section>

      {/* Main Categories Hook */}
      <Categories />
      
      {/* Featured Products Section */}
      <FeaturedProducts />
      
      <Reveal>
      {/* Logistics Section - Redesigned to be more compact with fresh background */}
      <section id="logistics" className="py-8 md:py-12 bg-[#F1F8F1] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative">
            
            {/* Left Image Component */}
            <div className="w-full md:w-5/12 relative">
              <div className="relative rounded-xl overflow-hidden shadow-xl z-10 border-[4px] border-white">
                <img 
                  src="/images/storage_facility_agri.png" 
                  alt="Hirato Logistics Facility" 
                  className="w-full h-[200px] md:h-[280px] object-cover"
                />
              </div>
              <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-60"></div>
            </div>

            {/* Right Content Component */}
            <div className="w-full md:w-7/12 relative z-20">
              <span className="text-[#1E5D57] font-bold uppercase tracking-[0.3em] text-[8px] md:text-[9px] mb-2 block">
                Logistics & Supply
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-[#2A3324] font-inter leading-tight mb-4">
                Precision <span className="text-[#E37A53]">Storage</span> & <br/>
                Fast Supply Chain
              </h2>

              {/* Overlapping Card */}
              <div className="bg-[#F6F9F6] p-5 md:p-6 rounded-xl shadow-lg shadow-slate-200/40 border border-[#E2EDE2] relative md:-ml-12 mt-1">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-[#E37A53] rounded-full flex items-center justify-center text-white shadow-md">
                   <MapPin size={16} />
                </div>
                
                <p className="text-slate-600 text-[11px] md:text-xs leading-relaxed mb-4 font-medium italic">
                  "Located in Bareilly, our state-of-the-art facilities ensure safe handling and rapid distribution of all agricultural products."
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <h4 className="text-[#2A3324] font-bold text-[11px] md:text-xs">Regional Hub</h4>
                    <p className="text-slate-400 text-[9px] md:text-[10px]">Uttar Pradesh, Bareilly</p>
                  </div>
                  <Link to="/godown" className="bg-[#1E5D57] hover:bg-[#132c20] text-white px-4 py-1.5 rounded-full font-bold text-[10px] tracking-wide transition-all shadow-sm">
                    Explore Godown
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      {/* Final Contact Section - Redesigned to be more compact */}
      <section id="contact-hook" className="py-10 md:py-16 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10 relative">
            
            {/* Left Content Component */}
            <div className="w-full md:w-7/12 relative z-20">
              <span className="text-green-700 font-bold uppercase tracking-[0.3em] text-[9px] mb-2 block">
                Start Your Journey
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-[#2A3324] font-inter leading-tight mb-6">
                Ready to <span className="text-green-600">Grow?</span> <br/>
                Talk to Our Experts Today.
              </h2>

              {/* Overlapping Card */}
              <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl shadow-green-900/5 border border-slate-100 relative md:-mr-10 z-30">
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-5 font-medium">
                  Sustainable science for high-yield results is just a conversation away. Our consultants are ready to help you optimize your crop production.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/contact" className="bg-[#3A5A38] hover:bg-[#2D472B] text-white px-6 py-2.5 rounded-full font-bold text-[11px] tracking-widest transition-all shadow-lg active:scale-95 text-center w-full sm:w-auto">
                    GET IN TOUCH NOW
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Image Component */}
            <div className="w-full md:w-5/12 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl z-10 border-[4px] border-slate-50 rotate-[1deg] hover:rotate-0 transition-transform duration-700">
                <img 
                  src="/images/happy_farmer_consultant.png" 
                  alt="Agricultural Consultant" 
                  className="w-full h-[220px] md:h-[300px] object-cover"
                />
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-3 -top-3 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-white shadow-md rotate-12 z-20">
                 <Flower2 size={24} className="animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>
    </div>
  );
};

export default HomePage;
