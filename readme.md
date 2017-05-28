# view-graphql [![Build Status](https://secure.travis-ci.org/des-des/view-graphql.svg?branch=master)](https://travis-ci.org/des-des/view-graphql) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

simple view layer for graphql

This is a proof of concept / prototype.

The idea here is that the graphql query required to render the view is dynamically created from the template.

## Installation

```bash
npm install --save view-graphql
```

## Usage

```javascript
var viewGraphql = require('view-graphql')

viewGraphql({
  queryTarget: 'https://www.graphqlhub.com/graphql', // endpoint to query
  bindToDom: true // causes automatic injection of html to node with id 'root'
}, (
  component, // template literal tag function
  graph // this walks the graph exposed by the endpoint. The result gets injected into the template
) => component`
  <div class='tc'>
    <h2> HN </h2>
    ${graph('hn', 'topStories(limit: 10)').map(graph => component`
    <a href=${graph('url')} class='link'>
      <div class='w-80 bg-red dib ma2 bg-animate hover-bg-light-red'>
        <h3 class='f3'> [${graph('score')}] : ${graph('title')} </h3>
      </div>
    </a>
    `)}
  </div>`
)
```

## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted with <3 by Eoin McCarthy ([@desmond_eoin](https://twitter.com/desmond_eoin)).

***

> This package was initially generated with [yeoman](http://yeoman.io) and the [p generator](https://github.com/johnotander/generator-p.git).
