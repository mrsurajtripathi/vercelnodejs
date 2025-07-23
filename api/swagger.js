"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerOptions = void 0;
// src/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User CRUD API',
            version: '1.0.0',
            description: 'API for managing users using Express + TypeScript',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['src/routes/*.ts'], // <- Path to your route files
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(exports.swaggerOptions);
