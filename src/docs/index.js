import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './swagger.definition.js'

const swaggerRouter = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml'],
});

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  })
);
export default swaggerRouter;
