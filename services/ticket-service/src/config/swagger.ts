import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Service API',
      version: '1.0.0',
      description: 'Support ticket management service for E-Storefront platform',
      contact: {
        name: '3A Softwares',
        email: 'support@3asoftwares.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3009}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(specs) as any);
};
