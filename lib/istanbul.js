var istanbul = require('istanbul');
var path = require('path');
var fs = require('fs');
var os = require('os');
var rimraf = require('rimraf');

exports.instrument = function(filesSrc,options){
    if (options && options.istanbul && options.istanbul.instrumenter) {
        options = options.istanbul.instrumenter;
    } else {
        options = undefined;
    }


    var instrumenter = new istanbul.Instrumenter(options);
    var i = 0;
    var instrumenedFiles = [];

    var tmpdir = path.join(os.tmpdir(),'grunt-lib-istanbul');
    if (!fs.existsSync(tmpdir)) {
        fs.mkdirSync(tmpdir);
    }

    filesSrc.forEach(function(file){

        var code = fs.readFileSync(path.join(process.cwd(),file),{encoding:'utf8'});
        var instrumentedCode = instrumenter.instrumentSync(code, file);

        var filename = path.join(tmpdir,file.replace(/\//g, '__'));
        fs.writeFileSync(filename, instrumentedCode);

        instrumenedFiles.push(filename);
    });

    return instrumenedFiles;
};

exports.writeReport = function(coverageJson,options) {
    if (options && options.istanbul){
        options = options.istanbul;
    } else {
        options = {};
    }

    var reportType = (options.report !== undefined ? options.report : 'text-summary');
    options = { dir : options.directory ? options.directory : 'coverage'};

    var collector = new istanbul.Collector();
    collector.add(coverageJson);
    var reporter = istanbul.Report.create(reportType, options);
    reporter.writeReport(collector, true);
};

exports.cleanUp = function(){
    var tmpdir = path.join(os.tmpdir(),'grunt-lib-istanbul');
    if (fs.existsSync(tmpdir)) {
        rimraf.sync(tmpdir);
    }
};