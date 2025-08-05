import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Navbar from "./components/Navbar";
import PlayerRegistrationForm from "./components/player/PlayerRegistrationForm";
import AuthForm from "./components/player/AuthForm";
import PlayerLoginForm from "./components/player/PlayerLoginForm";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import PlayerProfile from "./components/player/PlayerProfile.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import MatchSchedule from "./components/match/MatchSchedule.jsx";
import TournamentList from "./components/tournament/TournamentList.jsx";
import PlayerList from "./components/player/PlayerList.jsx";
import ContactPage from "./components/ContactPage.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="postman-toast"
        bodyClassName="postman-toast-body"
      />
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/register" element={<PlayerRegistrationForm />} />
        <Route path="/login" element={<PlayerLoginForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<MatchSchedule/>} />
        <Route path="/tournaments" element={<TournamentList/>} />
        <Route path="/players" element={<PlayerList/>} />
         <Route path="/contact" element={<ContactPage/>} />



        {/* Private route example */}

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PlayerProfile />
            </PrivateRoute>
          }
        />
        {/* Add other private routes similarly */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
