import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/profile.jsx";
import Createnote from "./components/CreateNotes.jsx";
import Editnote from "./components/EditNotes.jsx";
import Othersprofile from "./pages/OthersProfile.jsx";
import Message from "./components/Message.jsx";
import Privacypolicy from "./pages/PrivacyPolicy.jsx";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/createNote" element={<Createnote />} />
        <Route path="/editNote" element={<Editnote />} />
        <Route path="/othersProfile/:id" element={<Othersprofile />} />
        <Route path="/message/:userId" element={<Message />} />
        <Route path="/privacyPolicy" element={<Privacypolicy />} />
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </div>
  );
}
