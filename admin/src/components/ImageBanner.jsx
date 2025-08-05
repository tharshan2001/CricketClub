const ImageBanner = () => {
  return (
    <>
      {/* Sticky Banner */}
      <div className="sticky top-0 z-40 w-full h-[150px] overflow-hidden cursor-pointer px-6 sm:px-12 md:px-20 py-6">
        {/* Background with subtle blur - extends to edges */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[px]"
          style={{
            backgroundImage: 'url(https://i.pinimg.com/1200x/82/37/dd/8237dd76bd8b21da2214095416ba4a25.jpg)',
          }}
        />
        
        {/* Content container with rounded corners and dark overlay */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {/* Dark overlay (now inside rounded container) */}
          <div className="absolute inset-0 bg-black/60"></div>
          
          {/* Text content */}
          <div className="relative h-full flex items-center px-8 md:px-16">
            <h2 className="text-white text-4xl font-bold mb-2 tracking-tight drop-shadow-md">
              Admin Dashboard
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageBanner;