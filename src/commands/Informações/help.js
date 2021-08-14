const Command = require("../../Structures/Command")
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
			aliases: ['ajuda', 'commands'],
			name: "help",
			description: {
                pt: 'Mostra os comandos do bot',
            },
			category: 'Informações',
			enabled: true
        })
    }

    async run({ message, prefix }, lang) {

        let botInvite = new MessageButton()
        botInvite.setLabel(lang.help.botInvite)
        botInvite.setStyle("LINK")
        botInvite.setURL("https://discord.com/oauth2/authorize?client_id=876011887463133225&permissions=2150648832&scope=bot%20applications.commands")
        let row = new MessageActionRow()

        row.addComponents([botInvite])

        let embed = new MessageEmbed()
        embed.setAuthor(lang.help.title)
        embed.setDescription(lang.help.description.replace("{}", this.client.commands.size))
        embed.setFooter(lang.help.footer + owner.tag, owner.displayAvatarURL({ dynamic: true, size: 4096 }))
        embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
        
        let categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Desenvolvedor').map(cmd => cmd.category))

        for (const category of categories) {

            embed.addField(lang.help[category] + ' [' + this.client.commands.filter(cmd => cmd.category === category).size + ']', this.client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${prefix}${cmd.name}\``).join('**, **') + '.')
        }

        return await message.reply({ embeds: [embed], components: [row] })
    }
}