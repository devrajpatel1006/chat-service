const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Chat Service',
      version: '1.0.0',
      description: 'Chat Service APIs',
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [
      {
        jwt: ['admin','user'], // Specify the roles required for this security definition
      },
    ],
  },
  apis: ['./routes/api/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
