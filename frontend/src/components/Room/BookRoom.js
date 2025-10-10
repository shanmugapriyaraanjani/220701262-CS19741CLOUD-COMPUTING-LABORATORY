import React, { useState } from "react";
import RoomForm from "./RoomForm";
import Header from "./Header";
import { useHistory } from "react-router-dom";
import Chatbot from "../Chatbot";

const BookRoom = () => {
  let history = useHistory();
  const [chatOpen, setChatOpen] = useState(false);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <div style={{height:"100vh", position: 'relative'}}>
      <Header />
      <div className="bookRoom-section">
        <h2>Book a room</h2>
        <hr style={{ marginBottom: "1rem" }} />
        <RoomForm handleClose={handleClose} update={false}></RoomForm>
      </div>
      {/* Chatbot Button */}
      {!chatOpen && (
        <button
          style={{
            position: 'fixed', bottom: 30, right: 30, zIndex: 1000,
            background: '#4c1c56ff', color: 'white', border: 'none', borderRadius: '50%', width: 60, height: 60, fontSize: 28, boxShadow: '0 2px 8px #888', cursor: 'pointer'
          }}
          onClick={() => setChatOpen(true)}
          title="Open Chatbot"
        >💬</button>
      )}
      {chatOpen && <Chatbot open={true} onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default BookRoom;
