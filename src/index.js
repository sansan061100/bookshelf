const Hapi = require('@hapi/hapi');
const route = require('./routes');

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    await server.start();
    server.route(route);
    console.log('Server running on %s', server.info.uri);
};


init();