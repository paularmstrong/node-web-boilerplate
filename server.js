var express = require('express'),
    template = require('node-t'),
    config = require('./config/config-app'),
    _ = require('underscore'),
    app = express.createServer();

app.use(express.logger(config.logger));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'awesome sauce' }));
app.use(app.router);
app.use(express.static(config.public));

app.use(function (err, req, res, next) {
    res.render('500', { status: 500 });
});
app.use(function (req, res) {
    res.render('404', { status: 404 });
});

app.register('.html', template);
template.init({ root: config.viewDirectory });
app.set('views', config.viewDirectory);
app.set('view engine', 'html');
app.set('view options', {
    layout: false
});

function controllerAction(name, action, fn) {
    return function (req, res, next) {
        var render = res.render,
            format = req.params.format,
            path = config.viewDirectory + '/' + name + '/' + action + '.html';

        res.render = function (obj, options, fn) {
            res.render = render;
            // Template path
            if (typeof obj === 'string') {
                return res.render(obj, options, fn);
            }

            var data = _.union({}, obj);

            // Format support
            if (format) {
                if (format === 'json') {
                    return res.send(data, { 'Content-Type': 'application/json' }, res.status | 200);
                } else {
                    throw new Error('unsupported format "' + format + '"');
                }
            }

            if (data.hasOwnProperty('template') && data.template) {
                path = data.template;
                delete data.template;
            }

            // Render template
            res.render = render;
            options = options || {};
            // Expose obj as the "users" or "user" local
            options.locals = res.locals();

            if (req.hasOwnProperty('form') && !req.form.isValid) {
                options.locals.formErrors = req.form.getErrors();
            }

            if (options.locals) {
                options.locals = _.union(data, options.locals);
            } else {
                options.locals = data;
            }

            return res.render(path, options, fn);
        };
        fn.apply(this, arguments);
    };
}

app.get('/', controllerAction('app', 'index', function (req, res) {
    return res.render({});
}));

app.listen(3000);
