# www.goodguywarren.com

This is the source code for [www.goodguywarren.com](https://www.goodguywarren.com).

This website is completely static and is meant to be hosted on Github Pages using Jekyll. Since it does compile into a static site it can be hosted pretty much anywhere.

Besides the Jekyll components of the site, there is a node application `cli.js` that builds some of the static resources- specifically the contents of `_memes/` (Jekyll html files) and `assets/ew/` (image files). This creates a static webpage for every combination of quote and image in the site.


## Updating Static Resources

Any time you change the `_data` or `assets/images` files the static resources need to be rebuilt.

```
./cli.js images
./cli.js pages
```


## Adding Quotes

Quotes are stores in `_data/quotes.yaml`. The easiest way to add a new quote is to scroll to the bottom, copy the last quote, and paste it in with the new data.

It is important to always maintain the order of the quotes, as that order is what generates the IDs. Changing the order will also change the contents of existing links.

Always include a source.


## Adding Images

Images should be added to `assets/images` and then get their details added to `_data/images.yaml`.

Just like with quotes, is important to always maintain the order of the images, as that order is what generates the IDs. Changing the order will also change the contents of existing links.

Each image has data describing its `height`, `width`, `fontColor`, and `fontShadowColor`. When selecting colors it's important to have a high contrast between the font and the text, with the `fontShadowColor` being generally matching the dominant image color- white text with black shadow works in most cases (except where the image has a lot of white where the text is).

Only use images with licenses that support it- restricting the license on Google Image Search is one way to find new images.
