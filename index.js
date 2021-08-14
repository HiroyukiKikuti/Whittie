require("colors")
console.log("[LOGIN] - Iniciando bot".green)

const WhittieClient = require("./src/Structures/WhittieClient")
const Loader = require("./src/Structures/Loader")
const config = require("./src/System/Config")
const client = new WhittieClient(config)
new Loader(client).start()

client.connect()