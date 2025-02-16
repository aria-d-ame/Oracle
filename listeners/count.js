const { Listener } = require('gcommands');
const counting = require('../schemas/countingSchema.js');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Counting',
  event: 'messageCreate',

  run: async (ctx) => {
    if (!ctx.guild) return;
    if (ctx.author.bot) return;

    try {
        const data = await counting.findOne({ Guild: ctx.guild.id });
        if (!data) return;

        if (ctx.channel.id !== data.Channel) return;

        // Check if message content is a number
        const number = Number(ctx.content);
        if (isNaN(number)) {
            // Optionally react or notify user for invalid input
            return;
        }


        if (number !== data.Number) {
            // Reset count data and notify user
            data.Number = 1; // Reset to initial value
            data.LastUser = null; // Reset the last user
            await data.save();
            await ctx.react('❌');
            const embed = new EmbedBuilder()
                .setColor(`orange`)
                .setDescription(`🔸That wasn't the right number! Now we start from one!`)

            await ctx.reply({ embeds: [embed] });

        } else if (data.LastUser === ctx.author.id) {
            data.Number = 1; // Reset to initial value
            data.LastUser = null; // Reset the last user
            await data.save();
            await ctx.react('❌');
            const embed = new EmbedBuilder()
                .setColor(`orange`)
                .setDescription(`🔸You can't count twice in a row! Start from one!`)

            await ctx.reply({ embeds: [embed] });

        } else {
            await ctx.react('🟢');
            data.LastUser = ctx.author.id;
            data.Number++;
            await data.save();
        }

        if (number === 69) {
            await ctx.react('👌');
        }

        if (number % 100 === 0) {
            await ctx.react('💯'); 
        }

    } catch (error) {
        console.error('Error handling message:', error);
    }
  }
})