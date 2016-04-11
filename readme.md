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
