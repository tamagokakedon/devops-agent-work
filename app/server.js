require('newrelic');

const express = require('express');
const app = express();
const port = 80;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// health check endpoint
app.get('/', (req, res) => {
    res.status(200).send({ status: 'ok', message: 'DevOps Agent Test App is running' });
});

// 意図的なエラー
app.get('/error', (req, res) => {
    console.error('Intentional error triggered via /error endpoint');
    throw new Error('DevOps Agent Verification: Intentional Test Error');
});

// 意図的な遅延
app.get('/latency', (req, res) => {
    const ms = parseInt(req.query.ms) || 1000;
    console.log(`Simulating latency of ${ms}ms...`);

    setTimeout(() => {
        res.status(200).send({ status: 'ok', message: `Responded after ${ms}ms latency` });
    }, ms);
});

// cpu負荷
app.get('/cpu-stress', (req, res) => {
    const duration = parseInt(req.query.duration) || 5000;
    const start = Date.now();

    console.log('Starting CPU stress test...');
    while (Date.now() - start < duration) {
        Math.random() * Math.random();
    }

    res.status(200).send({ status: 'ok', message: 'CPU stress test completed' });
});

app.listen(port, () => {
  console.log(`Test app listening on port ${port}`);
});