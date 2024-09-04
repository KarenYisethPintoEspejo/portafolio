const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const config = {
    port: process.env.EXPRESS_PORT,
    host: process.env.EXPRESS_HOST,
    static: process.env.EXPRESS_STATIC
};

app.use(express.static(config.static));

app.get('/', (req, res) => {
    res.sendFile(path.join(config.static, ''));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Error interno del servidor'
    });
});

app.listen(config.port, config.host, () => {
    console.log(`http://${config.host}:${config.port}`);
});