"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const db_1 = require("../databases/db");
exports.userController = {
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield db_1.pool.connect();
        try {
            const { rows } = yield db_1.pool.query('SELECT * FROM users');
            res.send(rows);
        }
        catch (error) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    }),
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const result = yield db_1.pool.query('INSERT INTO users(name,email,password_hash,is_active,role) VALUES($1, $2, $3, $4,$5) RETURNING *', [name, email, password, 1, 1]);
            res.status(200).send({ status: 1, message: 'User Added', userid: result.rows[0].id });
        }
        catch (error) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.params.id);
        let id = req.params.id || undefined;
        if (!id) {
            res.status(200).send({ status: 1, error: 'Invalid Parameter' });
        }
        try {
            yield db_1.pool.query('DELETE FROM users WHERE id = $1', [id]);
            res.status(200).send({ status: 1, message: 'User deleted' });
        }
        catch (error) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let id = req.params.id || undefined;
            const { name, email, password } = req.body;
            const result = yield db_1.pool.query('UPDATE users set  WHERE id= $1 RETURNING *', [id]);
            res.status(200).send({ status: 1, message: 'User Added', userid: result.rows[0].id });
        }
        catch (error) {
            res.status(400).send({ status: 0, error: error.message || error });
        }
    })
};
