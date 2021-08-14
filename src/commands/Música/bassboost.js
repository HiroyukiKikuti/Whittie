const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "bassboost",
            aliases: ['bass'],
            category: "Música",
            description: {
                pt: "Ativa o filtro bassboost na música",
            },
            enabled: true
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        if (!player) return await message.reply(lang.filters.nothing)

        if (!player.bassboost) {
            player.setBassboost(true)
            return await message.reply(lang.filters.enabled.replace("{}", this.name))
        }
    
        if (player.bassboost) {
            player.setBassboost(false)
            return await message.reply(lang.filters.disabled.replace("{}", this.name))
        }
    }
}