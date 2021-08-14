  
const Command = require("../../Structures/Command")
const { MessageEmbed } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "tocando",
            aliases: ['np', 'nowplaying'],
            description: {
                pt: "Mostra a música que esta tocando no momento",
            },
            category: "Música",
            enabled: true,
        })
    }

    async run({ message }, lang) {

        const player = this.client.music.players.get(message.guild.id);

        if (!player) return message.reply(lang.resume.nothing)

        const track = player.queue.current;

        let embed = new MessageEmbed()
        embed.setAuthor(`${lang.np.titleEmbed.replace("{}", `${message.guild.name}`)}`, message.guild.iconURL({dynamic: true}))
        embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
        embed.setDescription(lang.np.descriptionEmbed)
        embed.addFields(
            {
                name: `${lang.np.name}`,
                value: `**[${track.title}](${track.url})**`,
                inline: true
            },
            {
                name: `${lang.np.quemPediu}`,
                value: `\`${this.client.users.cache.get(track.requester.id).tag}\``,
                inline: true
            },
            {
                name: `${lang.np.proximaMusica}`,
                value:  `${player.queue.values().next().value ? `\`${player.queue.values().next().value.title}\`` : "Não tem próxima música..."}`,
                inline: false,
            },
            {
                name: `${lang.np.duracao}`,
                value:  `\`${this.msToHour(player.position)}\`**${this.progressBarEnchanced((player.position / 1000) / 50, (track.duration / 1000) / 50, 15)}**\`${this.msToHour(track.duration)}\``,
                inline: false, 
            },
        )
        return message.reply({ embeds: [embed] })
    }
    msToHour(time){
        time = Math.round(time / 1000);
        const s = time % 60 ,
        m = ~~((time / 60) % 60),
        h = ~~(time / 60 / 60);

        return h === 0 ? `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` 
        : `${String(Math.abs(h) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`

      }
      progressBarEnchanced(current, total, barSize) {
          const progress = Math.round((barSize * current) / total);

          return ( 
           "⚋".repeat(progress > 0 ? progress - 1 : progress) +
           "⭕" +
           "━".repeat(barSize - progress)   
          )
      }
}