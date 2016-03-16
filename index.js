var gulp = require('gulp');
var Elixir = require('laravel-elixir');

var $ = Elixir.Plugins;
var config = Elixir.config;
var _ = require('underscore');

_.mixin({
    deepExtend: require('underscore-deep-extend')(_)
});

$.nunjucksRender = require('gulp-nunjucks-render');
$.htmlmin = require('gulp-htmlmin');

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

Elixir.extend('nunjucks', function(src, output, nunjucksOptions, htmlminOptions) {
    nunjucksOptions = typeof nunjucksOptions !== 'undefined' ?  nunjucksOptions : {};
    htmlminOptions = typeof htmlminOptions !== 'undefined' ?  htmlminOptions : {};
    config.templating = typeof config.templating !== 'undefined' ? config.templating : {};

    config.templating.nunjucks = _.deepExtend({
        folder: 'nunjucks',
        outputFolder: '',
        options: {
            path: 'resources/assets/nunjucks',
            inheritExtension: true,
            envOptions: {
                tags: {
                    variableStart: '{$',
                    variableEnd: '$}'
                }
            }
        }
    }, config.templating.nunjucks, {
        options: nunjucksOptions
    });

    config.templating.htmlmin = _.deepExtend({
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        caseSensitive: true
    }, config.templating.htmlmin, htmlminOptions)

    var paths = prepGulpPaths(src, output);

    new Elixir.Task('nunjucks', function() {
        this.log(paths.src, paths.output);

        return (
            gulp
            .src(paths.src.path)
            .pipe($.nunjucksRender(config.templating.nunjucks.options)
                .on('error', function(e) {
                    new Elixir.Notification().error(e, 'Nunjucks Compilation Failed!');

                    this.emit('end');
                }))
            .pipe($.if(config.production, $.htmlmin(config.templating.htmlmin)))
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Elixir.Notification('Nunjucks Compiled!'))
        );
    })
    .watch(config.templating.nunjucks.options.path + '/**/*')
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
        .src(src, config.get('assets.templating.nunjucks.folder'))
        .output(output || config.get('public.templating.nunjucks.outputFolder'), '.');
}
