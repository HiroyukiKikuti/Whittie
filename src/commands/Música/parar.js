const Command = require("../../Structures/Command")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: "parar",
            aliases: ['stop'],
            category: "Música",
            description: {
                pt: "Para de tocar as músicas",
            },
            enabled: true
        })
    }

    async run({ message }, lang) {
        const player = this.client.music.players.get(message.guild.id)

        if (!player) return await message.reply(lang.stop.nothing)

        const { channel } = message.member.voice
    
        if (!channel) return await message.reply(lang.stop.channelError);
        
        if (channel.id !== player.voiceChannel) return await message.reply(lang.stop.channelError2);
    
        player.destroy();
        return await message.reply(lang.stop.destroyed);
    }
}