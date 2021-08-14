const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "loop",
            category: "Música",
            description: {
                pt: "Ativa ou desativa o loop da fila ou música atual",
            },
            usage: {
                pt: "<QUEUE | TRACK>",
            },
            args: true,
            enabled: true,
            guildOnly: true
        })
    }

    async run({ message, args }, lang) {

        const player = this.client.music.players.get(message.guild.id)

        if (!player) return message.reply(lang.loop.nothing)

        const { channel } = message.member.voice

        if (!channel) return message.reply(lang.join.error)
        if (channel.id !== player.voiceChannel) return message.reply(lang.skip.channelError2)

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat)
            const queueRepeat = player.queueRepeat ? lang.loop.queueLoopE : lang.loop.queueLoopD
            return message.reply(queueRepeat)
        }

        player.setTrackRepeat(!player.trackRepeat)
        const trackRepeat = player.trackRepeat ? lang.loop.trackLoopE : track.loop.trackLoopD
        return message.reply(trackRepeat)
    }
}