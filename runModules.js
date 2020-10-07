const p = require('postcss')
const n = require('postcss-nested')
const m = require('./src/plugins/modules')


const raw = `
.class {
  margin: 5px;
  & .class2 {
    color: red;
  }
}

:global(.classGlobal) {}

@keyframes move_eye { from { margin-left:-20%; } to { margin-left:100%; }  }
@keyframes :global(kfGlobal) { from { margin-left:-20%; } to { margin-left:100%; }  }
`

async function run(css) {
    const json = {}
    const res = (await p([n, m({json})]).process(css, {from: '/1.css'})).css
    console.log(json)
    return res
}
run(raw).then(console.log)
