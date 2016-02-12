# Laravel Elixir Nunjucks

This Laravel Elixir extension allows you to render Nunjucks.

## Installation

```
npm install laravel-elixir-nunjucks
```

## Usage

Assuming you write...

```js
elixir(function(mix) {
    mix.nunjucks('public');
});
```

...this will render your `resources/assets/nunjucks/public` folder to `public`. 

If you'd like to set a different output directory, you may pass a second argument to the nunjucks() method, like so:

```js
mix.nunjucks('public', 'resources/views')
```

### One Gotcha

With Nunjucks, you normally render a variable like so: `{{ variable }}`. With this extension, the default syntax has been changed to `{$ variable $}`, since so so many Laravel users use Blade and Vue and it's rather cumbersome to escape the variable syntax with Nunjucks. If you'd like to revert to the default syntax, or if you want to override the Nunjucks plugin options, you may pass an object as the third argument.

```js
mix.nunjucks('public', null, {path: 'resources/assets/nunjucks'});
// See options at: https://www.npmjs.com/package/gulp-nunjucks-render#options
```

The above code will reset the variable syntax. Notice you should still include a `path` property. This is necessary for Nunjucks to render properly, and should always be set to the relative path of all your Nunjucks files. In our example above, `resources/assets/nunjucks` is where we store all our Nunjucks files, so `extends` paths will be relative to this directory. However, only the `resources/assets/nunjucks/public` folder will be rendered. This is useful when you have a decent amount of Nunjucks files, but you don't want to render all of them.

### Rendering to Blade
Though it seems rather redundant, if you'd like to render all your Nunjucks files to Blade, you can do something like this:

```js
mix.nunjucks('.', 'resources/views', {path: 'resources/assets/nunjucks', ext: '.blade.php'});
```