const MatchScheduleBanner = () => {
  return (
    <div className="relative w-full h-[150px] cursor-pointer px-6 sm:px-12 md:px-20 py-6 mb-4 mt-20">
      {/* Cricket Stadium Background - Now properly sized */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/50/f6/95/50f695cf6ca13375a585a66179241444.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark overlay with rounded corners */}
      <div className="relative w-full h-full rounded-xl bg-black/60">
        {/* Match schedule content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center space-y-2">
          <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-md">
            Match Schedule
          </h2>
          <p className="text-orange-300 font-medium text-lg sm:text-xl drop-shadow-sm">
            Season 2024-25 • All Tournament Matches
          </p>

        </div>
      </div>
    </div>
  );
};

export default MatchScheduleBanner;