const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Video service api specification',
    description: '비디오 api anstj',
    version: '0.0.1',
  },
  basePath: '/api',
  servers: [
    {
      url: `http://localhost:3000/api`,
      description: 'localhost',
    },
  ],
};

export default swaggerDefinition;

