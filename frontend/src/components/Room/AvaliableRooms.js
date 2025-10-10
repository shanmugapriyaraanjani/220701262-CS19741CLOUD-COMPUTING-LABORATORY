import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../../App.css";
import { getAvailableRooms } from "../services";
import { Card, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";


const AvailableRooms = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomsByBlock, setRoomsByBlock] = useState(null); // null means not loaded yet
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState("A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let history = useHistory();

  // Dummy data generator for each block
  function getDummyRooms() {
    const rooms = [];
    for (let i = 1; i <= 10; i++) {
      rooms.push({
        room_id: i,
        roomNumber: `R${i.toString().padStart(3, '0')}`,
        type: 'room',
        dept_name: `Dept${i}`
      });
    }
    const labs = [];
    for (let i = 1; i <= 5; i++) {
      labs.push({
        room_id: 100 + i,
        roomNumber: `L${i.toString().padStart(3, '0')}`,
        type: 'lab',
        dept_name: `LabDept${i}`
      });
    }
    return [...rooms, ...labs];
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    if (!date || !startTime || !endTime) {
      setError("Please select date, start time, and end time.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      // Try real API first
      let data;
      try {
        data = await getAvailableRooms(date, startTime, endTime);
      } catch (err) {
        data = null;
      }
      // If no data or empty, use dummy data
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        data = {};
        ["A", "B", "C", "K", "TL", "D", "I"].forEach(block => {
          data[block] = getDummyRooms();
        });
      }
      setRoomsByBlock(data);
    } catch (err) {
      setError("Failed to fetch available rooms.");
    }
    setLoading(false);
  };



  // List of blocks
  const blocks = ["A", "B", "C", "K", "TL", "D", "I"];

  return (
    <>
      <Header />
      <div className="available_rooms_div">
        <h2 style={{ marginTop: "1rem" }}>Available Rooms & Labs</h2>
        <hr style={{ marginBottom: "1rem" }} />
        <Form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "1rem" }}>
            <Form.Group controlId="blockSelect" style={{ minWidth: 120, marginBottom: 0 }}>
              <Form.Label>Block Name</Form.Label>
              <Form.Control
                as="select"
                value={selectedBlock}
                onChange={e => setSelectedBlock(e.target.value)}
              >
                {blocks.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="date" style={{ minWidth: 140, marginBottom: 0 }}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="startTime" style={{ minWidth: 140, marginBottom: 0 }}>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="endTime" style={{ minWidth: 140, marginBottom: 0 }}>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: 24 }}>
            <Button type="submit" style={{ background: "#551858ff", minWidth: 100 }}>
              Search
            </Button>
            <Button variant="secondary" type="button" style={{ minWidth: 100 ,background: "#551858ff" }} onClick={() => { setDate(""); setStartTime(""); setEndTime(""); setError(""); setHasSearched(false); }}>
              Cancel
            </Button>
          </div>
        </Form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading...</p>}
        <div className="available_sub_div">
          {loading ? (
            <p>Loading...</p>
          ) : hasSearched ? (
            Object.keys(roomsByBlock || {}).length === 0 ? (
              <p>No available rooms/labs for the selected slot.</p>
            ) : (
              <div style={{ minWidth: 320 }}>
                <h4>Block {selectedBlock}</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "1rem",
                  maxWidth: 1100,
                  margin: "0 auto"
                }}>
                  {roomsByBlock[selectedBlock] && roomsByBlock[selectedBlock].length > 0 ? (
                    roomsByBlock[selectedBlock].slice(0, 15).map((room, i) => (
                      <Card
                        data-aos="fade-left"
                        key={room.room_id || i}
                        className="available-card"
                        style={{ minWidth: 150, maxWidth: 200, marginBottom: 8 }}
                      >
                        <Card.Header>{room.type === "lab" ? "Lab" : "Room"}</Card.Header>
                        <Card.Body>
                          <Card.Title>
                            {room.type === "lab" ? "Lab" : "Room"}: {room.roomNumber}
                          </Card.Title>
                          <Card.Text>Department: {room.dept_name || "-"}</Card.Text>
                          <Button
                            onClick={() => history.push(`/bookRoom/${room.room_id}`)}
                            variant="dark"
                            className="auth-button"
                            style={{ border: "none", outline: "none" }}
                          >
                            Book {room.type === "lab" ? "Lab" : "Room"}
                          </Button>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <p>No rooms in this block.</p>
                  )}
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AvailableRooms;
