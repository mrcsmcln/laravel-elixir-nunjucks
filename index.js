var gulp = require('gulp');
var Elixir = require('laravel-elixir');

var $ = Elixir.Plugins;
var config = Elixir.config;

$.nunjucksRender = require('gulp-nunjucks-render');

/*
 |----------------------------------------------------------------
 | Nunjucks Compilation
 |----------------------------------------------------------------
 |
 | This task offers a simple way to render your Nunjucks assets.
 | You can either render a single file or a entire directory.
 | Don't forget the path if you specify alternate options.
 |
 */

Elixir.extend('nunjucks', function(src, output, options) {
    config.nunjucks = {
        folder: 'nunjucks',
        outputFolder: '',
        options: {
            path: 'resources/assets/nunjucks',
            envOptions: {
                tags: {
                    variableStart: '{$',
                    variableEnd: '$}'
                }
            }
        }
    };

    var paths = prepGulpPaths(src, output);
    var watchPath = options && options.path ? 
        options.path + '/**/*' : config.nunjucks.options.path + '/**/*';

    new Elixir.Task('nunjucks', function() {
        this.log(paths.src, paths.output);

        return (
            gulp
            .src(paths.src.path)
            .pipe($.nunjucksRender(options || config.nunjucks.options)
                .on('error', function(e) {
                    new Elixir.Notification().error(e, 'Nunjucks Compilation Failed!');

                    this.emit('end');
                }))
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Elixir.Notification('Nunjucks Compiled!'))
        );
    })
    .watch(watchPath)
    .ignore(paths.output.path)
});


/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  baseDir
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
var prepGulpPaths = function(src, output) {
    return new Elixir.GulpPaths()
        .src(src, config.get('assets.nunjucks.folder'))
        .output(output || config.get('public.nunjucks.outputFolder'), '.');
}
