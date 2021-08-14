const Command = require("../../Structures/Command")
const { MessageEmbed } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            description: { 
                pt: "Mostra o ping do bot",
            },
            category: "Informações",
            guildOnly: false,
            enabled: true
        })
    }

    async run({ message }) {

        const msg = await message.reply("🏓")

        const tLatency = msg.createdTimestamp - message.createdTimestamp
    
        await msg.edit(`Ping: ${this.client.ws.ping}ms | API: ${tLatency}ms`)
    }
}