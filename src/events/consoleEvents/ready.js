const Event = require("../../Structures/Event")
module.exports = class extends Event {

    async run() {

        this.client.music.init(this.client.user.id)
        
        console.log("[LOGIN] - Iniciado com sucesso".green)

        this.client.user.setPresence({
            activities: [{ 
                name: `Em breve um bot famoso.`,
                type: 5,
            }]
        })

        setInterval(() => {
            this.client.user.setPresence({
                activities: [{ 
                    name: `Whittie ( BETA )`,
                    type: 5,
                }]
            })
        }, 60000)
    }
}