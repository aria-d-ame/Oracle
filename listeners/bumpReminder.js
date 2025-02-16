const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Bump Reminder',
  event: 'messageCreate',

  run: async (ctx) => {
    const timerDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const bumpSchema = require('../schemas/bumpSchema.js');
    let timer;
    // Check if the message is from Disboard
    if (ctx.author.id === '302050872383242240') {
        const guildId = ctx.guild.id;
        const channelId = ctx.channel.id; // Get the channel ID
        const responseChannel = ctx.guild.channels.cache.get(channelId);

        // Save the current bump time
        await bumpSchema.findOneAndUpdate(
            { guildId, channelId },
            { lastBumpTime: new Date() },
            { upsert: true, new: true }
        );


        if (responseChannel) {
            const remind = new EmbedBuilder()
                .setColor(`orange`)
                .setTimestamp()
                .setFooter({
                    text: `${ctx.guild.name}`, // Footer text
                    iconURL: ctx.guild.iconURL() // Optional: Server icon URL
                })
                .setDescription(`🔸Thank you for bumping!\n🔸I'll be back in 2 hours!`)
            await responseChannel.send({ embeds: [remind] });

            // Clear any existing timer
            if (timer) clearTimeout(timer);

            // Set a new timer
            timer = setTimeout(async () => {
                const channel = ctx.guild.channels.cache.get(channelId);
                if (channel) {
                    const remind2 = new EmbedBuilder()
                        .setColor(`orange`)
                        .setTimestamp()
                        .setFooter({
                            text: `${ctx.guild.name}`, // Footer text
                            iconURL: ctx.guild.iconURL() // Optional: Server icon URL
                        })
                        .setTitle(`🔸It's time to bump!`)
                        .setDescription(`🔸Do /bump to bump O R A C L E!`)
                    await responseChannel.send({ content: '🔸<@&1330004364349149208>🔸', embeds: [remind2] });

                }
            }, timerDuration);
        } else {
            console.error('Channel not found');
        }
    }
  }
})