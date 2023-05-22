/* eslint-disable quote-props */
/* eslint-disable indent */
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = {
    info: {
        swagger: '2.0',
        version: '2.0.0',
        title: 'Task App',
        description:
            'Task App APIs',
    },
    Server: process.env.BASE_URL_SWAGGER,
    // basePath: '/api',
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'jwt',
            in: 'header',
        },
    },
};
const options = {
    swaggerDefinition,
    apis: ['./swagger/*.js'],
};

exports.swaggerSpec = swaggerJSDoc(options);
