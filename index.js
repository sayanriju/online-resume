const ejs = require("ejs")
const yamlReader = require("yaml-reader")
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

async function getData() {
  const [employments, projects, floss, general] = await Promise.all([
    await yamlReader.readAsync("data/employments.yaml"),
    await yamlReader.readAsync("data/projects.yaml"),
    await yamlReader.readAsync("data/floss.yaml"),
  	await yamlReader.readAsync("data/general.yaml"),
  ])
  return { employments, projects, floss, general }
}

async function hydrate(data) {
  const html = await ejs.renderFile("templates/index.ejs", data, { async: true })
  return html
}

async function build(html) {
  await writeFile("www/index.html", html)
  return "OK"
}


getData()
  .then(hydrate)
  .then(build)
  .then(console.log)
  .catch(console.log)
