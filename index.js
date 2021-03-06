const ejs = require("ejs")
const readYaml = require("read-yaml")
const util = require("util")
const fs = require("fs")
const pdf = require("html-pdf")

const readYamlAsync = util.promisify(readYaml)
const writeFile = util.promisify(fs.writeFile)

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
  const [html, pdfHtml] = await Promise.all([
    ejs.renderFile("templates/index.ejs", data, { async: true }),
    ejs.renderFile("templates/pdf.ejs", data, { async: true }),
  ])
  return { html, pdfHtml }
}

async function createPdfFile(html, filePath) {
  return new Promise((resolve, reject) => {
    pdf.create(html).toFile(filePath, function(err, res){
      if (err) return reject(err)
      return resolve(res.filename)
    });
  })
}

async function build({ html, pdfHtml }) {
  await Promise.all([
    writeFile("www/index.html", html),
    createPdfFile(pdfHtml, "www/sayanriju-resume.pdf")
  ])
  return "OK"
}


getData()
  .then(hydrate)
  .then(build)
  .then(console.log, console.log)
