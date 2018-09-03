const ejs = require("ejs")
const readYaml = require("read-yaml")
const util = require("util");
const fs = require("fs");

const writeFile = util.promisify(fs.writeFile)
const readYamlAsync = util.promisify(readYaml)

async function getData() {
  const [employments, projects, floss, general] = await Promise.all([
    await readYamlAsync("data/employments.yml"),
    await readYamlAsync("data/projects.yml"),
    await readYamlAsync("data/floss.yml"),
  	await readYamlAsync("data/general.yml"),
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
