import React from "react";

const NewsSection = () => {
  const newsItems = [
    {
      id: 1,
      title: "New Coaching Staff Joins Club",
      date: "2023-05-10",
      summary:
        "We are excited to announce two new coaches joining our staff this season...",
      category: "Announcement",
      author: "Club Admin",
      imageUrl: "https://i.pinimg.com/736x/80/a5/1a/80a51a577ce4554849807e94f95c528a.jpg"
    },
    {
      id: 2,
      title: "Summer Tournament Schedule Released",
      date: "2023-05-05",
      summary:
        "The full schedule for our summer tournament is now available...",
      category: "Tournament",
      author: "Tournament Director",
      imageUrl: "https://i.pinimg.com/736x/58/6f/22/586f22e9238f2e11b081a431493f0b77.jpg"
    },
    {
      id: 3,
      title: "New Training Facility Opens",
      date: "2023-05-15",
      summary:
        "Our state-of-the-art training facility is now open for all club members...",
      category: "Facilities",
      author: "Club President",
      imageUrl: "https://i.pinimg.com/1200x/bd/01/74/bd01749acec0a5da064fa655c5af90b5.jpg"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Club News &amp; Announcements
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Stay updated with the latest from our club
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.length > 0 ? (
            newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  className="w-full h-48 object-cover"
                  src={news.imageUrl || "/news-default.jpg"}
                  alt={news.title}
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(news.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {news.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{news.summary}</p>
                  <div className="flex justify-between items-center">
                    <a
                      href={`/news/${news.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read more →
                    </a>
                    <span className="text-xs text-gray-500">{news.author}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No news available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;