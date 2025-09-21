const express = require("express");

const Router = express.Router();

const db = require("../connection");

Router.get("/bookedRooms", (req, res) => {
  db.query("SELECT * FROM booking", (err, rows, fields) => {
    if (!err) {
      res.status(200).send(rows);
    } else {
      throw err;
    }
  });
});

Router.get("/bookedRooms/:username", (req, res) => {
  const userName = req.params.username;
  db.query(
    `SELECT * FROM booking where name="${userName}"`,
    (err, rows, fields) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        throw err;
      }
    }
  );
});

Router.post("/bookRoom", (req, res) => {
  const roomDetails = req.body;
  const query = `INSERT INTO booking (room_id,roomNumber,name,email,phoneNumber,event,start_time,end_time,event_date) values("${roomDetails.room_id}","${roomDetails.room}","${roomDetails.name}","${roomDetails.email}","${roomDetails.phoneNumber}","${roomDetails.event}","${roomDetails.startTime}","${roomDetails.endTime}","${roomDetails.date}")`;
  db.query(query, (err, rows, fields) => {
    if (!err) {
      res.status(200).send();
    } else {
      throw err;
    }
  });

  const eventQuery = `CREATE EVENT deleteRoom${roomDetails.room_id} ON SCHEDULE AT "${roomDetails.date} ${roomDetails.endTime}" DO DELETE FROM booking where room_id=${roomDetails.room_id}`;

  db.query(eventQuery, (err, rows, fields) => {
    if (!err) {
      res.status(200).send();
    } else {
      throw err;
    }
  });
});

Router.delete("/deleteRoom/:bookingId", (req, res) => {
  const id = req.params.bookingId;
  const query = `DELETE FROM booking WHERE room_id=${id}`;
  db.query(query, (err, rows, fields) => {
    if (!err) {
      res.status(200).send();
    } else {
      throw err;
    }
  });

  const eventQuery = `DROP EVENT deleteRoom${id}`;
  db.query(eventQuery, (err, rows, fields) => {
    if (!err) {
      res.status(200).send();
    } else {
      throw err;
    }
  });
});


// Updated endpoint: /availableRooms?date=YYYY-MM-DD&start_time=HH:MM:SS&end_time=HH:MM:SS
Router.get("/availableRooms", (req, res) => {
  const { date, start_time, end_time } = req.query;
  if (!date || !start_time || !end_time) {
    return res.status(400).json({ error: "Missing date, start_time, or end_time" });
  }

  // Query: select rooms/labs not booked for the given slot
  // Assumes rooms table has 'block' and 'type' columns
  const query = `
    SELECT * FROM rooms r
    WHERE r.room_id NOT IN (
      SELECT b.room_id FROM booking b
      WHERE b.event_date = ?
        AND ((b.start_time < ? AND b.end_time > ?) OR (b.start_time < ? AND b.end_time > ?) OR (b.start_time >= ? AND b.end_time <= ?))
    )
  `;
  // The above checks for any overlap with the requested slot
  db.query(query, [date, end_time, start_time, start_time, end_time, start_time, end_time], (err, rows, fields) => {
    if (!err) {
      // Group by block
      const grouped = {};
      rows.forEach(room => {
        const block = room.block || 'Other';
        if (!grouped[block]) grouped[block] = [];
        grouped[block].push(room);
      });
      res.status(200).send(grouped);
    } else {
      throw err;
    }
  });
});

Router.get("/roomNumbers", (req, res) => {
  const query = `SELECT roomNumber,room_id FROM rooms WHERE room_id NOT IN (SELECT room_id from booking)`;
  db.query(query, (err, rows, fields) => {
    if (!err) {
      res.status(200).send(rows);
    } else {
      throw err;
    }
  });
});

Router.post("/updateRoom", (req, res) => {
  const roomDetails = req.body;
  const query = `UPDATE booking set room_id="${roomDetails.room_id}",roomNumber="${roomDetails.room}",phoneNumber="${roomDetails.phoneNumber}",event="${roomDetails.event}",end_time="${roomDetails.endTime}",event_date="${roomDetails.date}",start_time="${roomDetails.startTime}"  where room_id="${roomDetails.previous_rid}"`;
  db.query(query, (err, rows, fields) => {
    if (!err) {
      res.status(200).send();
    } else {
      throw err;
    }
  });

  const eventQuery = `ALTER EVENT deleteRoom${roomDetails.room_id} ON SCHEDULE AT "${roomDetails.date} ${roomDetails.endTime}" DO DELETE FROM booking where room_id=${roomDetails.room_id}`;
  db.query(eventQuery, (err, rows, fields) => {
    if (!err) {
      res.status(200).send();
    } else {
      throw err;
    }
  });
});

module.exports = Router;