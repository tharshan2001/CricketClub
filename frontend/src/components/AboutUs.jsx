const AboutUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Our Cricket Club
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Passion, dedication, and sportsmanship since 2005
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="/team-photo.jpg"
              alt="Cricket Team"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To foster a love for cricket, develop skills at all levels, and promote teamwork and fair play in a competitive yet friendly environment.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our History</h3>
                <p className="text-gray-600">
                  Founded in 2005 with just 12 members, we've grown to become one of the region's most respected clubs with over 150 active players across multiple age groups and skill levels.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Values</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Respect for the game, opponents, and officials</li>
                  <li>Continuous improvement through practice and coaching</li>
                  <li>Inclusivity for players of all backgrounds and abilities</li>
                  <li>Community engagement and youth development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;