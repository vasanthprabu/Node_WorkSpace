const http = require('http');
const app = require('./app');
const express = require('express');
const path = require('path');
const port = process.env.port || 3200;
const server = http.createServer(app);
server.listen(port);
console.log('Server started with port -->'+port);
