const fetch = require('isomorphic-fetch')

const mergeStringArrays = (x, y) => {
  return x.reduce((out, part, i) => {
        const yi = y[i]
        return out + (yi ? part + yi : part)
      }, '')
}

const getIn = ([key, ...path], data) => {
  var next = data[cleanBrackets(key)]
  if (path.length === 0 || next === undefined) return next

  return getIn(path, next)
}

const objToQuery = (o) => {
  const keys = Object.keys(o)
  if (keys.length === 0) return ''
  return `{ ${keys
    .map(key => `${key} ${objToQuery(o[key])}`)
    .join(' ')}} `
}

const buildQueryFromPaths = queryParts => {
  const out = {}
  queryParts.forEach(sections => {
    let tip = out
    let nextTip

    sections.forEach((section, i) => {
      const target = tip[section]
      if (target) {
        nextTip = target
        tip = nextTip
        return
      }
      nextTip = {}
      tip[section] = nextTip
      tip = nextTip
    })
  })
  return objToQuery(out)
}

const cleanBrackets = str => {
  let out = ''
  let skip = false
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (skip) {
      if (c === ')') {
        skip = false
      }
    } else if (c === '(') {
      skip = true
    } else {
      out += c
    }
  }
  return out
}

const viewGraphql = (options, fn) => {
  options = options || {}

  const my = {}
  const self = {}

  const queryPaths = []
  my.queryPaths = queryPaths

  var queryResult = false
  my.queryResult = queryResult

  const createGetter = path => data => getIn(path, data)

  const query = (queryPath, getData) => {
    queryPaths.push(queryPath)

    const self = {}

    self.getData = getData

    const map = f => {
      const mapQuery = (...path) => query([...queryPath, ...path], createGetter(path))

      const mapComponent = f(mapQuery)

      return {
        isComponent: true,
        render: data => self
          .getData(data)
          .map(elemData => mapComponent.render(elemData))
          .join('')
      }
    }
    self.map = map

    const isQuery = true
    self.isQuery = isQuery

    return self
  }

  const simpleQuery = (...path) => query(path, createGetter(path))

  var buildQuery = () => {
    return buildQueryFromPaths(queryPaths)
  }

  var component = (textParts, ...inputs) => {
    const self = {}

    const isComponent = true
    self.isComponent = isComponent

    const render = data => {
      const results = inputs.map(input => {
        if (input.isQuery) return input.getData(data)

        if (input.isComponent) return input.render(data)

        return input
      })
      return mergeStringArrays(textParts, results)
    }
    self.render = render

    return self
  }

  var render = () => {
    if (options.queryTarget) {
      options.executeQuery = query => fetch(options.queryTarget, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      .then(response => response.json())
      .then(responseJSON => responseJSON.data)
    }

    return options.executeQuery(buildQuery()).then(queryResult => {
      return my.rootComponent.render(queryResult)
    })
  }
  self.render = render

  const rootComponent = fn(component, simpleQuery)
  my.rootComponent = rootComponent

  if (options.bindToDom) {
    self.render().then(html => {
      document.getElementById('root').innerHTML = html
    })
  }

  return self
}

viewGraphql.toDom = id => html => {
  document.getElementById(id).innerHTML = html
}

module.exports = viewGraphql
