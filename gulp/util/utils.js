'use strict';

const Path = require('path');
allowReturnOutsideFunctionInBrowserifyTransform();
const Fs = require('fs');
const Macro = require('./macro');

const preludePath = Path.resolve(__dirname, '../browserify_prelude.js');
const prelude = Fs.readFileSync(preludePath, 'utf8');

exports.uglifyOptions = function (platform, isJSB, isDebugBuild) {
    var global_defs = Macro(platform, isJSB, isDebugBuild);
    if (!global_defs['CC_DEBUG']) {
        return {
            compress: {
                global_defs: global_defs,
                // keep_infinity: true
            }
        };
    }

    return {
        mangle: false,
        //preserveComments: 'all',
        output: {
            // http://lisperator.net/uglifyjs/codegen
            beautify: true,
            bracketize: true,
        },
        compress: {
            // https://github.com/mishoo/UglifyJS2#compressor-options
            global_defs: global_defs,
            sequences: false,  // join consecutive statements with the “comma operator”
            properties: false,  // optimize property access: a["foo"] → a.foo
            //dead_code: true,  // discard unreachable code
            drop_debugger: false,  // discard “debugger” statements
            unsafe: false, // some unsafe optimizations (see below)
            //conditionals: false,  // optimize if-s and conditional expressions
            comparisons: false,  // optimize comparisons
            //evaluate: true,  // evaluate constant expressions
            booleans: false,  // optimize boolean expressions
            loops: false,  // optimize loops
            unused: false,  // drop unused variables/functions
            hoist_funs: false,  // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: false,  // optimize if-s followed by return/continue
            join_vars: false,  // join var declarations
            cascade: false,  // try to cascade `right` into `left` in sequences
            collapse_vars: false,
            //warnings: true,
            negate_iife: false,
            pure_getters: false,
            pure_funcs: null,
            drop_console: false,
            keep_fargs: true,
            keep_fnames: true,
            side_effects: false  // drop side-effect-free statements
        }
    };
};

function allowReturnOutsideFunctionInBrowserifyTransform () {
    var paths = [
        'browserify/node_modules/syntax-error/node_modules/acorn',
        'syntax-error/node_modules/acorn',
        'acorn'
    ];
    function patch (path) {
        var acorn = require(path);
        var parse = acorn.parse;
        if (typeof parse === 'function') {
            if (acorn.parse.name !== 'monkeyPatchedParse') {
                acorn.parse = function monkeyPatchedParse(input, options) {
                    if (options) {
                        options.allowReturnOutsideFunction = true;
                    }
                    else {
                        options = {
                            allowReturnOutsideFunction: true
                        };
                    }
                    return parse(input, options);
                };
            }
        }
        else {
            console.error('Can not find acorn.parse to patch');
        }
    }

    var patched = false;
    for (var i = 0; i < paths.length; i++) {
        try {
            patch(paths[i]);
            patched = true;
        }
        catch (e) {
        }
    }
    if (!patched) {
        console.error('Can not find acorn to patch');
    }
}

/*
 * @param [options.sourcemaps = true]
 * @param [options.babelifyOpt]
 */
exports.createBundler = function createBundler(entryFiles, options) {
    // https://github.com/substack/node-browserify#methods
    var browserifyOpt = {
        entries: [].concat(entryFiles),
        debug: (options && 'sourcemaps' in options) ? options.sourcemaps : true,
        detectGlobals: false,    // dont insert `process`, `global`, `__filename`, and `__dirname`
        bundleExternal: false,   // dont bundle external modules
        //standalone: 'engine-framework',
        //basedir: tempScriptDir

        // define custom prelude to optimize script evaluate time
        prelude: prelude,
        preludePath: Path.relative(process.cwd(), preludePath),
    };

    // var presets = [
    //     [ 'es2015', { loose: true } ],
    // ];

    var plugins = [
        // https://babeljs.io/docs/plugins/transform-es2015-shorthand-properties/
        'babel-plugin-transform-es2015-shorthand-properties',
        // https://babeljs.io/docs/plugins/transform-es2015-template-literals/
        'babel-plugin-transform-es2015-template-literals',
        // http://babeljs.io/docs/plugins/transform-es2015-block-scoping/
        'babel-plugin-transform-es2015-block-scoping',

        // < 6.16.0
        [ 'babel-plugin-parser-opts', { allowReturnOutsideFunction: true } ]
    ];

    var Babelify;
    try {
        Babelify = require('babelify');
    } catch (e) {
        console.error('Please run "npm install babelify".');
        throw e;
    }

    var b;
    if (options && options.cacheDir) {
        // https://github.com/royriojas/persistify
        const Persistify = require('persistify');
        b = Persistify(browserifyOpt, {
            recreate: false,
            cacheId: require('../../package.json').version + entryFiles,
            cacheDir: options.cacheDir
        });
    }
    else {
        const Browserify = require('browserify');
        b = new Browserify(browserifyOpt);
    }

    return b
        .exclude(Path.join(__dirname, '../../package.json'))
        .transform(Babelify, (options && options.babelifyOpt) || {
            // presets: presets,
            plugins: plugins,

            // >= 6.16.0
            // parserOpts: {
            //     allowReturnOutsideFunction: true,
            // },

            ast: false,
            babelrc: false,
            highlightCode: false,
            sourceMaps: true,
            compact: false
        });
};
