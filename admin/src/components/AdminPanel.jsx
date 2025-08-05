import React, { useState } from "react";

export default function AdminPanel({ contentComponent: ContentComponent }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  const navItems = [
    { icon: "📊", label: "Dashboard", view: "dashboard" },
    { icon: "📋", label: "Projects", view: "projects" },
    { icon: "❗", label: "Issues", view: "issues" },
    { icon: "📅", label: "Calendar", view: "calendar" },
    { icon: "⚙️", label: "Settings", view: "settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-blue-800 text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <span className="font-bold text-xl">{sidebarOpen ? "AdminPanel" : "AP"}</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="focus:outline-none hover:bg-blue-700 p-1 rounded"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex flex-col mt-4 space-y-1 px-2">
          {navItems.map(({ icon, label, view }) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`flex items-center space-x-2 p-3 rounded hover:bg-blue-700 ${
                activeView === view ? "bg-blue-600" : ""
              }`}
            >
              <span className="text-lg">{icon}</span>
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex items-center justify-between bg-white p-3 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold capitalize">{activeView}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <button className="p-2 rounded hover:bg-gray-200">🔔</button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
          </div>
        </header>

        {/* Content area - renders passed component */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {ContentComponent ? (
            <ContentComponent activeView={activeView} />
          ) : (
            <div className="bg-white p-8 rounded shadow text-center">
              <h2 className="text-2xl font-bold mb-4">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)} View
              </h2>
              <p className="text-gray-600">No component provided</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}