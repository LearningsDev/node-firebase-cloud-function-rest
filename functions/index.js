"use strict";

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const authMiddleware = require("./middleware/auth");

admin.initializeApp();
const app = express();

app.use(cors());
app.use(authMiddleware);


app.post("/add", async (req, res) => {
  const body = req.body;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection("planets").add({
    name: body.name, mass: body.mass, diameter: body.diameter,
    density: body.density, gravity: body.gravity,
    escapeVelocity: body.escapeVelocity,
    rotationPeriod: body.rotationPeriod, dayLength: body.dayLength,
    sunDistance: body.sunDistance, orbitalPeriod: body.orbitalPeriod,
    meanTemperature: body.meanTemperature, moons: body.moons,
  });
  res.json({
    result: `Planet with name: ${body.name} and id: ${writeResult.id} added.`,
  });
});

app.get("/planet/:id", async (req, res) => {
  const readResult = admin.firestore().collection("planets").doc(req.params.id);
  const doc = await readResult.get();
  if (!doc.exists) {
    // eslint-disable-next-line object-curly-spacing
    res.status(500).send({ "error": "invalid ID" });
  } else {
    res.status(200).send(doc.data());
  }
});

app.get("/all", async (req, res) => {
  const readResult = admin.firestore().collection("planets");
  const snapshot = await readResult.get();

  const planetsAll = [];
  snapshot.forEach((doc) => {
    const obj = {};
    obj["key"] = doc.id;
    obj["value"] = doc.data();
    planetsAll.push(obj);
  });
  res.status(200).send(planetsAll);
});

app.post("/update", async (req, res) => {
  const body = req.body;

  const dxRef = admin.firestore().collection("planets").doc(body.id);

  return dxRef.update({
    name: body.name, mass: body.mass, diameter: body.diameter,
    density: body.density, gravity: body.gravity,
    escapeVelocity: body.escapeVelocity,
    rotationPeriod: body.rotationPeriod, dayLength: body.dayLength,
    sunDistance: body.sunDistance, orbitalPeriod: body.orbitalPeriod,
    meanTemperature: body.meanTemperature, moons: body.moons,
  }).then(() => {
    const readResult = admin.firestore().collection("planets");
    return readResult.get().then((snapshot) => {
      const planetsAll = [];
      snapshot.forEach((doc) => {
        const obj = {};
        obj["key"] = doc.id;
        obj["value"] = doc.data();
        planetsAll.push(obj);
      });
      return res.status(200).send(planetsAll);
    });
  });
});

app.post("/delete", async (req, res) => {
  const body = req.body;
  admin.firestore().collection("planets").doc(body.id).delete().then((v) => {
    const readResult = admin.firestore().collection("planets");
    return readResult.get().then((snapshot) => {
      const planetsAll = [];
      snapshot.forEach((doc) => {
        const obj = {};
        obj["key"] = doc.id;
        obj["value"] = doc.data();
        planetsAll.push(obj);
      });
      return res.status(200).send(planetsAll);
    });
  });
});


exports.planetary = functions.https.onRequest(app);

