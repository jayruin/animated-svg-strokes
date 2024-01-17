# Installation

The latest version of the library is available as a module on the `dist` branch and also available on [jsDelivr](https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/strokes.js).

## Script

If using modules, mark the calling script with `type="module"`:

```html
<script type="module" src="index.js"></script>
```

Then import within the script:

```javascript
import { strokes } from "/url/to/strokes.js";
```

If using regular scripts, use the dynamic import API:

```javascript
import("/url/to/strokes.js").then((mod) => {
    const { strokes } = mod;
});
```

## Anki

There are some extra things to consider when using JavaScript within Anki:
- Anki will not load scripts with the `src` attribute
- Anki will cache script files and there is no easy way to clear the cache

Thus, it is recommended to place a helper file in your `collection.media` directory named `_strokes.js` (it MUST begin with underscore or Anki will not sync it) with the following content (replacing `URL`, `FORMAT`):

```javascript
export async function main(source, src, dst, error) {
    try {
        const { strokes } = await importNoCache(URL);
        const options = {
            // Customize here
        };
        const render = strokes({ source, format: FORMAT, options });
        const srcElement = document.querySelector(src);
        const char = srcElement.textContent;
        const outputElement = await render(char);
        const dstElement = document.querySelector(dst);
        clear(dstElement);
        dstElement.appendChild(outputElement);
    }
    catch (e) {
        const errorElement = document.querySelector(error);
        clear(errorElement);
        errorElement.appendChild(document.createTextNode(e));
    }
};

async function importNoCache(url) {
    const response = await fetch(url, {cache: "no-store"});
    const blob = await response.blob();
    const newUrl = URL.createObjectURL(blob);
    const result = await import(newUrl);
    URL.revokeObjectURL(newUrl);
    return result;
}

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}
```

Then within your card, add the following (replacing `CHAR` and `SOURCE`):
```
<div id="char">CHAR</div>
<div class="strokes-output">Rendering strokes...</div>
<div id="error"></div>

<script>
var render = async () => {
    var { main } = await import("./_strokes.js");
    main(SOURCE, "#char", ".strokes-output", "#error");
};
render();
</script>
```

If you wish to modify the contents `_strokes.js` (or any JavaScript file), you must rename the file, sync, rename back, sync again in order to force Anki to sync the new version.

## React

Create a wrapper component (replacing URL):

```javascript
import { useEffect, useState } from "react";

export function Strokes({ characterString, source, format, options }) {
    const [element, setElement] = useState(null);

    useEffect(() => {
        async function renderStrokes() {
            const { strokes } = await import(URL);
            const strokesElement = await strokes({ source, format, options })(characterString);
            setElement(strokesElement);
        }
        renderStrokes();
    }, []);

    return (
        element === null
            ? <div>Rendering strokes...</div>
            : <div ref={node => node?.childElementCount === 0 ? node.append(element) : undefined}></div>
    )
}
```