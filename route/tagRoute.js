const express = require('express');
const {createTag, getAllTags} = require('../controller/tagController')
const TagRoute = express.Router();

TagRoute.post('/tag',createTag);
TagRoute.get('/tag',getAllTags);

module.exports = TagRoute;