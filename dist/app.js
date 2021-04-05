"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const port = 5000;
const app = express_1.default();
app.get('/', (req, res, next) => {
    res.send('Hello, world');
});
let server;
if (fs_1.default.existsSync('./key.pem') && fs_1.default.existsSync('./cert.pem')) {
    server = https_1.default.createServer({
        key: fs_1.default.readFileSync('./key.pem', 'utf-8'),
        cert: fs_1.default.readFileSync('./cert.pem', 'utf-8')
    }, app).listen(port, () => { console.log('https server on ' + port); });
}
else {
    server = app.listen(port, () => {
        console.log('http server on ' + port);
    });
}
;
