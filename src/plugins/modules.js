const parser = require('postcss-selector-parser')

function hasGlobalParent(node) {
  while (node.parent) {
    node = node.parent
    if (node.type === parser.PSEUDO && node.toString().startsWith(':global'))
      return true
  }
  return false
}

const extractLocals = genName => selectors => {
  selectors.walkClasses(cls => {
    if (!hasGlobalParent(cls))
      cls.replaceWith(parser.className({value: genName(cls.value)}))
  });
  stripGlobal(selectors)
}

const stripGlobal = selectors => {
  selectors.walkPseudos(ps => {
    if (ps.toString().startsWith(':global'))
      ps.replaceWith(ps.nodes)
  });
}

function camelize(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

const plugin = ({json={}} = {}) => ({
  postcssPlugin: 'browser-modules',
  OnceExit(root) {
    const fn = root.source.input.from.replace('/', '_').replace('.', '_')

    function genName(name) {
      if (!json[name])
        json[name] = fn + '-' + name
      return json[name]
    }

    root.walk(node => {
      if (node.type === "rule") {
        node.selector = parser(extractLocals(genName)).processSync(node.selector)
      }
      else if (node.type === "atrule" && node.name === 'keyframes') {
        if (!node.params.startsWith(':global'))
          node.params = genName(node.params)
        else
          node.params = parser(stripGlobal).processSync(node.params)
      }
    })
    for (let [k, v] of Object.entries(json)) {
      const camel = camelize(k)
      if (!json[camel])
        json[camel] = v
    }
  }
})
plugin.postcss = true

module.exports = plugin

