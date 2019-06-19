# postcss-compose

[PostCSS](https://github.com/postcss/postcss) plugin enabling component composing using `@compose`

## Install
```js
npm install --save-dev postcss-compose
yarn add --dev postcss-compose
```

## Usage
```js
postcss([require('postcss-compose')])
```

### Before
```css
@compose red,blue {
    .bg-$(1) {
        background-color: $(1);
    }
}
```

### After
```css
.bg-red {
  background-color: red;
}

.bg-blue {
  background-color: blue;
}
```