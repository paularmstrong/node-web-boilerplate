var child_process = require('child_process'),
    fs = require('fs'),
    util = require('util'),
    files = [],
    restarting = false;

function writeStdOut(data) {
    process.stdout.write(data);
}

function writeStdErr(data) {
    util.puts(data);
}


function restart(serverProcess) {
    restarting = true;
    try {
        serverProcess.kill();
    } catch (e) {
        // The process is either already dead, or there are conflicting processes
        util.debug('ERROR: ' + e);
    }
}

function watchFile(serverProcess, file) {
    fs.watchFile(file, { interval: 500 }, function (current, previous) {
        if (current.mtime.valueOf() !== previous.mtime.valueOf() || current.ctime.valueOf() !== previous.ctime.valueOf()) {
            util.debug('File modified: ' + file);

            restart(serverProcess);
        }
    });
}

function watchFiles(serverProcess) {
    child_process.exec('find . | grep -E "\\.git|(^\\.$)|^\\.\\/node_modules" -v', function (error, stdout, stderr) {
        var foundFiles = stdout.trim().split("\n"),
            i = foundFiles.length,
            file;

        while (i) {
            i -= 1;
            file = foundFiles[i];
            if (!fs.statSync(file).isDirectory()) {
                files.push(foundFiles[i]);
                watchFile(serverProcess, foundFiles[i]);
            }
        }
    });
}

function unwatchFiles() {
    var i = files.length;

    while (i) {
        i -= 1;
        fs.unwatchFile(files[i]);
    }
    files = [];
}

function startServer() {
    util.debug('Starting Development Server...');
    var serverProcess = child_process.spawn('node', ['--debug', 'server.js']);
    watchFiles(serverProcess);

    serverProcess.stdout.addListener('data', writeStdOut);
    serverProcess.stderr.addListener('data', writeStdErr);

    serverProcess.addListener('exit', function (code) {
        util.debug('Stopping Development Server...');
        serverProcess = null;
        if (restarting) {
            unwatchFiles(serverProcess);
            startServer();
            restarting = false;
        }
    });
}

startServer();
