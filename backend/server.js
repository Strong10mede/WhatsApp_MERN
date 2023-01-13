// cluster are the servers which run database
//express.js running on port 9000

// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import cors from "cors";
//to make mongodb realtime justlike onSnapshot
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1537146",
  key: "41d9bd9f58f24962151e",
  secret: "3b6dd64bde6c7ce07a4f",
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB Connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//app config
const app = express();
//environment variable port or 9000
const port = process.env.PORT || 9000;

// middleware - handling the different routing of the webpage
app.use(express.json());
app.use(cors());

// DB config
// qY8IiKOiS0IpD2Xy
const connectionUrl =
  "mongodb+srv://root:root@cluster0.gca2meu.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//???

//api routes
//200 is a status code of getting data
//201 for sending data
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
