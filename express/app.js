var express = require('express'),
    bodyParser = require('body-parser'),
    glob = require('glob'),
    config = require('config'),
    dbConfig = config.get('production.db'),
    expressConfig = config.get('production.express'),
    orm = require('sequelize-singleton');

orm.discover = [__dirname + '/sequelize_models'];

orm.connect(dbConfig.dbname, dbConfig.username, dbConfig.password, {
    dialect: dbConfig.dialect,
    host: dbConfig.host,
    port: dbConfig.port,
    logging: dbConfig.logging
});

orm.sequelize.sync({force: false})
    .then(function () {
        var app = express();

        app.use(bodyParser.json());
        app.use(express.static(__dirname + '/../ember/dist'));

        glob.sync("./routes/api/**/*.js").forEach(function (filename) {
            app.use('/api', require(filename));
        });

        app.listen(expressConfig.port, function () {
            console.log('Webserver started');
        });
    })
    .error(function () {
        console.error(error);
        process.exit('Failed to sync database');
    });
