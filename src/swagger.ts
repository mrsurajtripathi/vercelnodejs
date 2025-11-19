// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

export function setupSwagger(app: Application) {
  const options: swaggerJSDoc.Options = {
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
    // Path to your route files with Swagger comments
    apis: ['src/routes/*.ts']
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

