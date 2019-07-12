const express = require("express");
const router = express.Router();

const Hubs = require("./hubs-model.js");

router.use(express.json());

//no longer need the /api/hubs because they are
//used/indicated in the index.js w/ the server.use() method
router.get("/", async (req, res) => {
  try {
    const hubs = await Hubs.find(req.query);
    res.status(200).json(hubs);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the hubs"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hub = await Hubs.findById(req.params.id);

    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "Hub not found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the hub"
    });
  }
});

router.get("/:id/messages", (req, res) => {
  const { id } = req.params;

  Hubs.findHubMessages(id)
    .then(messages => {
      if (messages && messages.length) {
        res.status(201).json(messages);
      } else {
        res.status(404).json({ message: "Cannot find" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error" });
    });
});

router.post("/", async (req, res) => {
  try {
    const hub = await Hubs.add(req.body);
    res.status(201).json(hub);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error adding the hub"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await Hubs.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The hub has been nuked" });
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error removing the hub"
    });
  }
});

router.post("/:id/messages", (req, res) => {
  if (!isValidMessage(req.body)) {
    res.status(400).json({ errorMessage: "bad panda! need sender and text" });
  } else {
    Hubs.addMessage(...req.body)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

function isValidMessage(message) {
  const { sender, text, hub_id } = message;

  return sender && text && hub_id;
}

router.put("/:id", async (req, res) => {
  try {
    const hub = await Hubs.update(req.params.id, req.body);
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: "The hub could not be found" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "Error updating the hub"
    });
  }
});

module.exports = router;
