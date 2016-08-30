# brandicons [![Build Status](https://secure.travis-ci.org/hanakin/brandicons.png?branch=master)](http://travis-ci.org/hanakin/brandicons)  [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]
### a set of brand  & social icons made to fit and mirror the google material design icons. These icons are meant to be coupled with the MDI to offset the lack of brand & social options.



## Getting Started

1. Download and extract the repository
2. Copy the `demo/icons.html` to your project
3. Include it using whatever template language your are working with after the `<body>` tag.
4. Add icons to your page like so, use the id for the icon you want from the html file above
```
<svg class="icon">
    <use xlink:href="#icon-id"></use>
</svg>
```
5. Use the `icon` class of the svg tag to style the icon.
6. For more finite control over specific icons add more classes to the svg tags
7. You can control the icon color using the css `color` property.

##Install using NPM
`npm install brandicons`


## Want to contribute?

1. Find an official source vector image.
2. Use your SVG editor of choice to produce a monochrome icon (with a view to keeping the file size as small as possible).
    - See [CSS Tricks](https://css-tricks.com/understanding-and-manually-improving-svg-optimization/)’s great article on manual SVG optimisation.
    - Please center icons in a 24x24 pixel viewbox, for consistency. With a max height/width of 20px for the icon.
    - Be sure to follow the google material design spec.
    - Add your icon to the newest version of the sketch file.
4. Submit an entry as a pull request containing the following information:
    - The Brand title
    - The HEX colour value
    - The URL of the site/app the logo is for.

##Changelog
- 1.0.1 cleaner gulpfile & folder structure. improved readme.
- 2.0.0 improved process to accomodate page specific icons & moved documentation to its own branch.
[Detailed changelog & contributors](/CHANGELOG.md)

Note: All brand icons are trademarks of their respective owners. The use of these trademarks does not indicate endorsement of the trademark holder by the author, nor vice versa.

[downloads-image]: http://img.shields.io/npm/dm/brandicons.svg?style=flat
[npm-url]: https://npmjs.org/package/brandicons
[npm-image]: http://img.shields.io/npm/v/brandicons.svg?style=flat
[issues-url]: https://github.com/hanakin/brandicons/issues
