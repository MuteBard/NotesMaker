"use strict";

const noteService = require('./NoteService');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/getFolders', (req, res) => {
    const result = noteService.getVisibleFolders();
    res.status(200).send(result);
});

app.post('/getSubFolders', async (req, res) => {
    const { data } = req.body;
    const result = await noteService.getSubFolders(data.key);
    res.status(200).send(result);
});

app.post('/createFolders', async (req, res) => {
    const { data } = req.body;
    console.log(data)
    const result = await noteService.createFolders(data);
    res.status(200).send(result);
});

app.post('/updateMarkDown', async (req, res) => {
    const { data } = req.body;
    console.log(data)
    const result = await noteService.updateMarkDown(data);
    res.status(200).send(result);
});

app.post('/updateProjects', async (req, res) => {
    const { data } = req.body;
    console.log(data)
    const result = await noteService.updateProjects(data);
    res.status(200).send(result);
});

app.listen(port);
