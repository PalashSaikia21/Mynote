import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Centersection from "../components/CenterSection.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [centerSection, setCenterSection] = useState("createNote");
  const [activeView, setActiveView] = useState("createNote");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || "";
    if (!user) {
      navigate("/login");
    } else {
      setName(user.name);
      setId(user._id);
    }
  }, []);
  return (
    <div>
      <Navigation
        name={name}
        id={id}
        page={"home"}
        setActiveView={setActiveView}
      />
      <Centersection activeView={activeView} setActiveView={setActiveView} />
      <Footer />
    </div>
  );
}

// {/-abc@gmail.com-/}
