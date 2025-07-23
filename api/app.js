"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
// src/server.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const createServer = () => {
    app.get('/', (_req, res) => {
        res.send(`Hello from worker ${process.pid}`);
    });
    app.listen(PORT, () => {
        console.log(`🚀 Worker ${process.pid} started on port ${PORT}`);
    });
};
exports.createServer = createServer;
/* import cluster from "node:cluster";
import os from "node:os";
import express from 'express';
import { createServer } from './app';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process PID: ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Fork workers
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Restarting...`);
    cluster.fork();
  });
} else {
  createServer();
} */
