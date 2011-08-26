module.exports = {
    root: __dirname + '/../',
    pathIgnore: ['*node_modules*']
};

// A lot of these parameters are backwards from the official docs. npm's Nodelint is quite out of date.
var options = {
    adsafe: false,
    bitwise: false,
    browser: false,
    cap: false,
    css: false,
    debug: false,
    devel: true,
    eqeqeq: true,
    evil: false,
    forin: false,
    fragment: false,
    immed: true,
    indent: 4,
    laxbreak: true,
    maxerr: 300,
    maxlen: 600,
    nomen: false,
    newcap: false,
    node: true, // jslint.com has an option for node, but the node module is not up to date yet
    on: false,
    onevar: true,
    passfail: false,
    plusplus: true, // true === don't tolerate pre-increment/post-increment
    predef: ['module', 'util', 'require', 'process', 'exports', 'escape', '__dirname', 'setTimeout'],
    regexp: false,
    rhino: false,
    safe: false,
    strict: false,
    sub: false,
    undef: true, // variables and functions must be defined before used
    white: true,
    widget: false,
    windows: false
};

