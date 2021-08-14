const Command = require('../../Structures/Command')
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "pesquisar",
            aliases: ["buscar", "search"],
            usage: {
                pt: "<NOME DA MÚSICA>",
            },
            description: {
                pt: "Pesquisa uma música e a coloca para tocar",
            },
            category: "Música",
            enabled: true,
            args: true
        })
    }

    async run({ message, args }, lang) {

        let play = this.client.music.players.get(message.guild.id)

        const { channel } = message.member.voice

        if (!channel) return await message.reply(lang.play.NoChannel)

        if (!play) {

            const player = this.client.music.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                selfDeafen: true
            })

            if (!channel.joinable) {
                return await message.reply(lang.play.permError)
            }

            await player.connect()

        }

        const player = this.client.music.players.get(message.guild.id)

        if (player.voiceChannel !== channel.id) {
            return await message.reply(lang.play.mes)
        }

        const search = args.join(' ')
        let res;

        try {
            res = await player.search(search, message.author)
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw new Error(res.exception.message);
            }
        } catch (err) {
            return await message.reply(lang.play.error + err.message);
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                await message.reply(lang.play.noResults);
            break;

            case 'PLAYLIST_LOADED':
                await message.reply(lang.play.noLinks)
                player.destroy()
            break;

            case 'TRACK_LOADED':
                await message.reply(lang.play.noLinks)
                player.destroy()
            break;

            case 'SEARCH_RESULT':
                let max = 15, collected, filter = (interaction) => ["musicSelector"].includes(interaction.customId)
                if (res.tracks.length < max) max = res.tracks.length;

                let options = res.tracks.slice(0, max).map(({ title, identifier }) => {
                    return { title, identifier }
                })


                const menu = new MessageSelectMenu()
                menu.setCustomId("musicSelector")
                menu.setPlaceholder(max + lang.play.musics)
                menu.setMinValues(1)
                menu.setMaxValues(max)


                let i = 0

                for (const a of options) {
                    i++
                    menu.addOptions([
                        {
                            label: `${i} | ${a.title.slice(0, 20)}`,
                            description: a.title.slice(0, 50),
                            value: a.identifier
                        }
                    ])
                }

                const row = new MessageActionRow()
                row.addComponents([menu])

                const results = res.tracks
                    .slice(0, max)
                    .map((track, index) => `\`${++index}.\` **[${track.title}](${track.uri})**`)
                    .join('\n')

                let embed3 = new MessageEmbed()
                embed3.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
                embed3.setTimestamp()
                embed3.setDescription(results)
                let msg = await message.reply({ embeds: [embed3], components: [row] })

                const collector = message.channel.createMessageComponentCollector({ filter, time: 60000, idle: 60000 })

                collector.on("end", async (interaction) => {
                    return await msg.edit({
                        components: []
                    })
                })

                collector.on("collect", async (interaction) => {

                    if (collector.users.first().id !== message.author.id) {
                        return interaction.reply({ content: lang.play.onlyAuthor, ephemeral: true })
                    }

                    switch(interaction.customId) {
                        case "musicSelector":

                            let track = []

                            for (const id of interaction.values) {
                                track.push(res.tracks.find(a => a.identifier === id))
                            }

                            player.queue.add(track)
                            if (!player.playing && !player.paused && player.queue.totalSize === track.length) await player.play()

                            if (message.slash) player.set('interaction', message)

                            let embed = new MessageEmbed()
                            embed.setColor(message.guild.me.roles.highest.color || this.client.settings.color)
                            embed.setDescription(lang.play.searchResults2.replace("{}", track.map((a, index) => `${index + 1}º **${a.title}**`).join("\n")))

                            await interaction.reply({ embeds: [embed], ephemeral: false })

                            await msg.edit({ components: [] })
                            collector.stop()
                        break;
                    }
                })
            break;
        }
    }
}