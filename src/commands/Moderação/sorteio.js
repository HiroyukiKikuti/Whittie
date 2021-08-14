const Command = require("../../Structures/Command")
const ClientEmbed = require("../../Structures/ClientEmbed");
const ms = require('ms');


module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "sorteio",
            category: "Moderação",
            usage: {
                pt: "<OPÇÕES | COLLECTORMSG>",
            },
            description: {
                pt: "Faz sorteios de alguma coisa no servidor",
            },
            args: false,
            enabled: true,
            userPerms: ["ADMINISTRATOR"]
        })
    }

    async run({ message, args, prefix }, lang) {

    let embednoArgs = new ClientEmbed()
        .setTitle(`🎉 | Sistema de sorteio do Whittie.`)
        .setDescription(`Faça sorteios usando esse comando!`)
        .addFields(
            {
                name: `❕ Inicia o sorteio`,
                value: `\`${prefix}sorteio iniciar\``,
            },
            {
                name: `❕ Troca o ganhador (faz reroll no sorteio)`,
                value: `\`${prefix}sorteio reroll\``,
            },
            {
                name: `❕ Edita as informaçoes do seu sorteio, tempo, ganhadores e prêmio`,
                value: `\`${prefix}sorteio editar\``,
            },
            {
                name: `❕ Deleta/termina o seu sorteio sem ganhadores`,
                value: `\`${prefix}sorteio deletar\``,
            },
        )

    if (!args[0]) return message.reply({ embeds: [embednoArgs]});

    /*START*/
    if (["iniciar", "começar", "start", "comecar"].includes(args[0].toLowerCase())) {

        message.channel.send(`❓ - ${message.author}, mencione o chat que você quer fazer o sorteio.\n\nCaso queira cancelar digite \`CANCELAR\` no chat a qualquer momento.`).then(async msg => {
            const filter = (x) => x.author.id === message.author.id;
            let cp = message.channel.createMessageCollector({ filter, time: 60000, max: 1})
            .on('collect', c => {
                if(['Cancelar', 'CANCELAR', 'cancelar'].includes(c.content)) return msg.edit(`<:correto_wizar:874608052228218911> - ${message.author}, comando cancelado com sucesso.`);
                
                setTimeout(() => c.delete(), 2000)

                let canal = c.mentions.channels.first()
                if(!canal) {
                    return message.channel.send(`<:errado_wizar:874608058028937246> - ${message.author}, você não mencionou um chat para eu fazer seu sorteio  \`COMANDO CANCELADO\` `);
                } else {


                msg.edit(`❓ - ${message.author}, agora fala para mim, qual vai ser o **tempo** do seu sorteio. \`EX: 10s, 10m, 10h, 10d\`\n\nCaso queira cancelar digite \`CANCELAR\` no chat a qualquer momento.`).then(async msg2 => {
                    const filter = (x) => x.author.id === message.author.id;
                    let cl = message.channel.createMessageCollector({ filter, time: 60000, max: 1})
                    .on('collect', c2 => {
                        if(['Cancelar', 'CANCELAR', 'cancelar'].includes(c.content)) return msg2.edit(`<:correto_wizar:874608052228218911> - ${message.author}, comando cancelado com sucesso.`);

                        setTimeout(() => c2.delete(), 2000)

                        let tempo = c2.content;


                        msg2.edit(`❓ - ${message.author}, agora me diga qual vai ser o **prêmio** do sorteio.\n\nCaso queira cancelar digite \`CANCELAR\` no chat a qualquer momento.`).then(async msg3 => {
                            const filter = (x) => x.author.id === message.author.id;
                            let ck = message.channel.createMessageCollector({ filter, time: 60000, max: 1})
                            .on('collect', c3 => {
                             if(['Cancelar', 'CANCELAR', 'cancelar'].includes(c.content)) return msg3.edit(`<:correto_wizar:874608052228218911> - ${message.author}, comando cancelado com sucesso.`);

                                 setTimeout(() => c3.delete(), 2000)

                                let premio = c3.content;


                                msg3.edit(`❓ - ${message.author}, agora me fale qual vai ser a **quantidade de vencedores** do sorteio.\n\nCaso queira cancelar digite \`CANCELAR\` no chat a qualquer momento.`).then(async msg4 => {
                                    const filter = (x) => x.author.id === message.author.id;
                                    let cc = message.channel.createMessageCollector({filter, time: 60000, max: 1})
                                    .on('collect', c4 => {
                                        if(['Cancelar', 'CANCELAR', 'cancelar'].includes(c.content)) return msg4.edit(`<:correto_wizar:874608052228218911> - ${message.author}, comando cancelado com sucesso.`);
                                        setTimeout(() => c4.delete(), 2000)

                                        let ganhadores = c4.content;
                                        msg4.delete()



                                        this.client.giveawaysManager.start(canal, {
                                            time: ms(tempo),
                                            prize: (premio),
                                            winnerCount: parseInt(ganhadores),
                                            hostedBy: message.author,
                                            messages: {
                                                giveaway: '||@everyone||\n🎉 Novo sorteio 🎉',
                                                giveawayEnded: '||@everyone||\n🎉 Sorteio finalizado 🎉',
                                                timeRemaining: '⌛ | Tempo restante: **{duration}**!',
                                                inviteToParticipate: 'Reaja a essa mensagem para participar',
                                                winMessage: 'Parabéns, {winners}! Você ganhou **{prize}**!\n',
                                                embedFooter: 'Whittie - Sorteio',
                                                noWinner: '👎 | O sorteio foi cancelado poís não houve participantes.',
                                                hostedBy: '🙎‍♂️ | Sorteado por: {user}',
                                                winners: 'Premiado(s)',
                                                endedAt: 'Terminou em',
                                                units: {
                                                    seconds: 'segundos',
                                                    minutes: 'minutos',
                                                    hours: 'horas',
                                                    days: 'dias',
                                                    pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                                                }
                                            }
                                        });
                                        message.reply(`<:correto_wizar:874608052228218911> - ${message.author}, Sorteio iniciado no canal ${canal}.`)
                                    })
                                })
                            })
                        })
                    })
                })
                }
            })
        })
    }
    /*START*/
    /*if (["info"].includes(args[0].toLowerCase())) {


        let onServer = this.client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);

        let notEnded = this.client.giveawaysManager.giveaways.filter((g) => !g.ended);

        if(!onServer || !notEnded) return message.reply(`Sem informações sobre os sorteios do servidor.`)


        const embedInfo = new ClientEmbed(author)
            .setTitle(`❕ | SORTEIO - Whittie`)
            .setDescription(`Informações sobre o sorteios do servidor`)
            .addFields(
                {
                    name: `${Emojis.monitor} Todos o sorteios:`,
                    value: `${onServer}`
                },
                {
                    name: `${Emojis.monitor} Sorteios não terminados:`,
                    value: `${notEnded}`
                }
            )

            message.reply({embeds: [embedInfo]})
    }
    */
    /*REROLL*/
    if (["reroll", "sorteardnv", "resortear"].includes(args[0].toLowerCase())) {

        let messageID = args[1];
        if(!args[1]) return message.reply(`<:errado_wizar:874608058028937246> - ${message.author}, você não informou o id do sorteio. \`ID DA MENSAGEM DO SORTEIO\``)

        this.client.giveawaysManager.reroll(messageID, {
            messages: {
                congrat: `<a:festa:872711113589014598> Novo ganhador: {winners}! Parabéns!`,
                error: 'ERRO: Não existe participantes nesse sorteio.'
            }
        }).then(() => {
            message.reply(`<:correto_wizar:874608052228218911> - ${message.author}, você trocou o ganhador do sorteio.`);

        }).catch((err) => {
            message.reply(`<:errado_wizar:874608058028937246> - ${message.author}, O sorteio não foi encontrado. \`ID DA MENSAGEM DO SORTEIO\``)
            console.log(err);
      })
    }
    /*REROLL*/
    /*EDITSORTEIO*/
    if (["editar", "edit"].includes(args[0].toLowerCase())) {

        let messageID = args[1];
        let newWinner = args[2];
        let newTime = args[3];
        let newPrize = args[4];

        if(!args[1] || !args[2] || !args[3] || !args[4]) return message.reply(`<:errado_wizar:874608058028937246> - ${message.author}, Use: ${prefix}sorteio editar <SorteioID> <Qntd de ganhadores> <Tempo do sorteio, em millisegundos> <Prêmio>\n\n\`OBS: Se você setar o tempo do sorteio para -5000 por exemplo ira diminuir 5 segundos ou seja\n10000 = 10s, 20000 = 20s e assim vai.\``)

        this.client.giveawaysManager.edit(messageID, {
            newWinnerCount: newWinner,
            newPrize: newPrize,
            addTime: newTime
        }).then(() => {
            const numberOfSecondsMax = this.client.giveawaysManager.options.updateCountdownEvery / 1000;
            message.reply(`<:correto_wizar:874608052228218911> - ${message.author}, sucesso, as informações do seu sorteio foram alteradas.`);
      }).catch((err) => {
          message.reply(`<:errado_wizar:874608058028937246> - ${message.author}, O sorteio não foi encontrado. \`ID DA MENSAGEM DO SORTEIO\``)
          console.log(err);

      })
    }
     /*EDITSORTEIO*/
     /*DELETE*/
     if (["delete", "deletar", "excluir", "terminar"].includes(args[0].toLowerCase())) {
         
        
        let messageID = args[1];
        if(!args[1]) return message.reply(`<:errado_wizar:874608058028937246> - ${message.author}, você não informou o id do sorteio. \`ID DA MENSAGEM DO SORTEIO\``)

        this.client.giveawaysManager.delete(messageID).then(() => {
            message.reply(`<:correto_wizar:874608052228218911> - ${message.author}, sucesso, o seu sorteio foi deletado/terminado.`);
        }).catch((err) => {
            message.reply(`<:errado_wizar:874608058028937246> - ${message.author}, O sorteio não foi encontrado. \`ID DA MENSAGEM DO SORTEIO\``)
            console.log(err);

        })
     }
     /*DELETE*/
  }
};
