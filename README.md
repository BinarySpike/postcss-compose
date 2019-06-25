# postcss-compose

[PostCSS](https://github.com/postcss/postcss) plugin enabling component composing using `@compose`

## Install
```js
npm install --save-dev postcss-compose
yarn add --dev postcss-compose
```

## Usage (with Tailwind support featured)
```js
var data = {
    styles: {
        red: {default: '#FF0000', hover: 'darkred' },
        blue: {default: 'blue', hover: '#0000AA' },
    }
}

module.exports = {
    plugins: [
        require('../postcss-compose/index.js')(data, true),
        require('tailwindcss'),
    ]
}
```

### Before
```css
@compose style in styles, {
    .bg-$(style) {
        color: $(style.default);
        @apply bg-$(style)-700;
    }
    .bg-$(style):hover {
        color: $(style.hover);
    }
}
```

### After
```css
.bg-red {
  color: #FF0000;
  background-color: #c53030; /* from @apply bg-red-700 */
}

.bg-red:hover {
  color: darkred;
}

.bg-blue {
  color: blue;
  background-color: #2b6cb0; /* from @apply bg-blue-700 */
}

.bg-blue:hover {
  color: #0000AA;
}
```