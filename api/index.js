"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var bodyParser = require('body-parser');
const app = (0, express_1.default)();
const users_1 = __importDefault(require("./routes/users"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
process.on('uncaughtException', (err) => {
    console.log(err);
});
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: true
}));
app.use(bodyParser.json({
    limit: '20mb'
}));
/** Router Block */
app.use('/users', users_1.default);
app.use('/blogs', blogs_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
/** End Router Block */
app.listen(3000, () => console.log("Server ready on port 3000."));
module.exports = app;
