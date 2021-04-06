"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routers/index"));
const feed_1 = __importDefault(require("./routers/feed"));
const main_1 = __importDefault(require("./routers/main"));
const user_1 = __importDefault(require("./routers/user"));
const port = 5000;
const app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use('/', index_1.default);
app.use('/feed', feed_1.default);
app.use('/user', user_1.default);
app.use('/main', main_1.default);
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
