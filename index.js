const config = require('./json/config.json')
const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require('node-fetch');


client.on('ready', () => {
    console.log(`Conetcado como: ${client.user.tag}`)
})

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.channel.type == 'dm') return;
    if (msg.author.id == client.user.id) return;
    if (!msg.content.startsWith(config.prefix)) return;
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando == 'beijar') {
        let userm = msg.mentions.users.first();
        if (!userm) return msg.reply('Mencione a pessoa que deseja beijar');
        const data = await fetch('https://nekos.life/api/v2/img/kiss')
            .then(res => res.json())
            .then(json => json);
        const url = data.url;
        let avatar = msg.author.displayAvatarURL({ format: 'png' });
        let embedreturn = new Discord.MessageEmbed()
            .setTitle('Aceita me beijar ?')
            .setColor('#000000')
            .setDescription(`O usuario ${msg.author} deseja te beijar, ${userm}.\nVoce aceita ?\nReaja com  :kissing_heart:  para aceitar ou  :rage:  			para recusar.`)
            .setThumbnail(avatar)
            .setAuthor(msg.author.tag, avatar);
        let messagereturn = await msg.channel.send(embedreturn);
        await messagereturn.react('😘');
        await messagereturn.react('😡');
        const reactions = ['😘', '😡'];
        const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === userm.id;
        const collector = messagereturn.createReactionCollector(filter, { time: 60000 })
        collector.on('collect', async emoji => {
            switch (emoji._emoji.name) {
                case ('😘'):
                    const embed1 = new Discord.MessageEmbed()
                        .setTitle('Beijo')
                        .setColor('#000000')
                        .setDescription(`${msg.author} acaba de beijar ${userm}`)
                        .setImage(url)
                        .setTimestamp()
                        .setThumbnail(avatar)
                        .setFooter('Kissu kissu kissu')
                        .setAuthor(msg.author.tag, avatar);
                    await msg.channel.send(embed1);
                    messagecheck.delete();
                    break;
                case ('😡'):
                    const embed2 = new Discord.MessageEmbed()
                        .setTitle('Recusou')
                        .setColor('#000000')
                        .setDescription(`${msg.author} acaba de recusar um beijo de ${userm}`)
                        .setImage()
                        .setTimestamp()
                        .setThumbnail(avatar)
                        .setFooter('recusou o beijo!')
                        .setAuthor(msg.author.tag, avatar);
                    await msg.channel.send(embed2);
                    messagecheck.delete();
                    break;
                default:
                    const embed3 = new Discord.MessageEmbed()
                        .setTitle('Nào respondido')
                        .setColor('#000000')
                        .setDescription(`${userm} nào respondeu o beijo a tempo!.`)
                        .setTimestamp()
                        .setThumbnail(avatar)
                        .setFooter('nào respondeu!')
                        .setAuthor(msg.author.tag, avatar);
                    await msg.channel.send(embed3);
                    messagecheck.delete();
                    break;
            }
        })
    }
})

client.login(config.token);