const gulp = require('gulp');
const Elixir = require('laravel-elixir');
const extend = require('lodash/extend');

let gulpNunjucksRender;

/*
 |----------------------------------------------------------------
 | Nunjucks Compilation Task
 |----------------------------------------------------------------
 |
 | This task offers a simple way to render your Nunjucks assets.
 | You can either render a single file or a entire directory.
 | Don't forget the path if you specify alternate options.
 |
 */

Elixir.config.nunjucks = {
    folder: 'nunjucks',
    outputFolder: '',
    search: '/**/*',
    options: {
        watch: Elixir.isWatching(),
        path: 'resources/assets/nunjucks',
    },
 };

class NunjucksTask extends Elixir.Task {
    /**
     * Create a new NunjucksTask instance.
     *
     * @param {string}      name
     * @param {GulpPaths}   paths
     * @param {object|null} options
     */
    constructor(name, paths, options) {
        super(name, null, paths);

        this.options = options;
    }

    /**
     * Lazy load the task dependencies.
     */
    loadDependencies() {
        gulpNunjucksRender = require('gulp-nunjucks-render');
    }

    /**
     * Build the Gulp task.
     */
    gulpTask($) {
        return (
            gulp
            .src(this.src.path)
            .pipe(this.nunjucks())
            .on('error', this.onError())
            .pipe($.if(!this.output.isDir, $.rename(this.output.name)))
            .pipe(this.saveAs(gulp))
            .pipe(this.onSuccess())
        );
    }

    /**
     * Run the files through Nunjucks.
     */
    nunjucks() {
        this.recordStep('Running Nunjucks');

        return gulpNunjucksRender(extend({
            path: Elixir.config.get('assets.nunjucks.folder'),
        }, Elixir.config.nunjucks.options, this.options));
    }

    /**
     * Register file watchers.
     */
    registerWatchers() {
        this
            .watch(`${Elixir.config.get('assets.nunjucks.folder')}/**/*`)
            .ignore(this.output.path)
        ;
    }
}

 Elixir.extend('nunjucks', (src, output, baseDir, options) => {
    new NunjucksTask('nunjucks', getPaths(src, baseDir, output), options);
 });

 /**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  baseDir
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
var getPaths = function(src, baseDir, output) {
    return new Elixir.GulpPaths()
        .src(src || '', baseDir || Elixir.config.get('assets.nunjucks.folder'))
        .output(output || Elixir.config.get('public.nunjucks.outputFolder'), 'app.html');
};
