# Readable sources for minified site assets

Files in /js and /css listed here are **minified builds**. Edit the readable copy in `_src/`, then rebuild:

```
npm i terser csso      # once, anywhere
node _src/minify.js    # writes minified files to /js and /css
```

`_src/` is in `.vercelignore`, so it is never deployed.

- js: header, footer, chatbot, pulse-forms, blog-motion, aesthetics-product
- css: header, footer, chatbot-widget, blog-motion, product-related, aesthetics-product
- `nodd.html` is the pre-minification copy of /aesthetics/nodd.html (page HTML is minified with html-minifier-terser).
