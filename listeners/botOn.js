const { Listener } = require('gcommands');
const { ActivityType, EmbedBuilder } = require('discord.js');

const timerDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const bumpSchema = require('../schemas/bumpSchema.js');
const counting = require('../schemas/countingSchema.js');
const levelSchema = require('../schemas/level.js');

const setupBumpReminders = async (ctx) => {
    const bumps = await bumpSchema.find({});
    
    bumps.forEach(bump => {
        const timeSinceLastBump = new Date() - new Date(bump.lastBumpTime);
        const timeUntilNextBump = timerDuration - timeSinceLastBump;

        if (timeUntilNextBump > 0) {
            setTimeout(async () => {
                const channel = await ctx.channels.cache.get(bump.channelId);
                
                if (channel) {
                    const remindEmbed = new EmbedBuilder()
                        .setColor(0xE67E22)
                        .setTimestamp()
                        .setFooter({
                            text: channel.guild.name,
                            iconURL: channel.guild.iconURL() // Optional: Server icon URL
                        })
                        .setTitle(`🔸It's time to bump!`)
                        .setDescription(`🔸Do /bump to bump O R A C L E`);

                    await channel.send({ content: '🔸<@&1330004364349149208>🔸', embeds: [remindEmbed] });
                }
            }, timeUntilNextBump);
        }
    });
}


new Listener({
  name: 'Bot Start',
  event: 'ready',

  run: async (ctx) => {
    console.log(`✅ ${ctx.user.tag} is online!`);
    ctx.user.setActivity("O R A C L E", {
        type: ActivityType.Watching,
        url: "https://discord.gg/MW3r57vamW"
    });
    const modChannelId = '1329993553212084386';
    const modChannel = ctx.channels.cache.get(modChannelId);
    if (modChannel) {
        await modChannel.send({ content: `${ctx.user.tag} is now online!` });
    } else {
        console.log('Mod channel not found.');
    };

    // Fetch bumps and set reminders
    await setupBumpReminders(ctx);

},
})