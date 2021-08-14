const Command = require("../../Structures/Command")
const { MessageEmbed } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "botinfo",
            description: {
                pt: "Mostra as informaçoes do bot",
            },
            aliases: ['infos', 'bi'],
            category: "Informações",
            enabled: true,
            guildOnly: false
        })
    }

    async run({ message }, lang) {

        let embed = new MessageEmbed()

        embed.addFields(
            {
                name: lang.botinfo.guilds,
                value: this.client.guilds.cache.size.toLocaleString(),
                inline: true
            },
            {
                name: "Uptime",
                value: this.client.utils.time(this.client.uptime),
                inline: true
            },
            {
                name: "Ping",
                value: this.client.ws.ping + 'ms',
                inline: true
            },
            {
                name: lang.botinfo.users,
                value: this.client.guilds.cache.map(g => g.memberCount).reduce((a, g) => a + g).toLocaleString(),
                inline: true
            },
            {
                name: lang.botinfo.memoryUsage,
                value: this.client.utils.formatBytes(process.memoryUsage().rss),
                inline: true
            }
        )
        embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
        embed.setTimestamp()
        embed.setFooter("Source da Ayume | BONEE to usando sua src kkk")
        //embed.setFooter("Este servidor usa " + this.client.utils.formatBytes(sizeof(message.guild)) + " da minha memoria")
        return await message.reply({ embeds: [embed] })
    }
}