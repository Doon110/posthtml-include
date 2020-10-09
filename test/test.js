const test = require('ava')
const plugin = require('../lib')
const posthtml = require('posthtml')

const {join} = require('path')
const {readFileSync} = require('fs')

const fixture = file => readFileSync(join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('Basic', t => {
  return process(t, 'basic')
})

test('Root option', t => {
  return process(t, 'root', {root: './test/fixtures/blocks/'})
})

test('Nested includes', t => {
  return process(t, 'nested')
})

test('Locals', t => {
  return process(t, 'locals')
})

test('Locals not json', t => {
  return process(t, 'locals-not-json')
})

test('Inner locals', t => {
  return process(t, 'inner-locals')
})

test('Shoult not cut children elements', t => {
  return process(t, 'not-clear-rest')
})

test('addDependency message', t => {
  const includePath = require('path').resolve('./test/fixtures/blocks/button/button.html')

  return posthtml()
    .use(plugin())
    .process('<include src="./test/fixtures/blocks/button/button.html">')
    .then(result => t.is(result.messages[0].file, includePath))
})
