const { Command, CommandType, Argument, ArgumentType, customId } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

new Command({
  name: 'vent',
  description: 'Vent anonymously!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'content',
      description: 'What would you like to say?',
      type: ArgumentType.STRING,
      required: true
    }),
  ],

  run: async (ctx) => {
    try{
      const user = ctx.user.id
      const content = ctx.arguments.getString('content');

      const ventEmbed = new EmbedBuilder()
      .setColor('orange')
      .setTitle(`🔸VENT🔸`)
      .setAuthor({ name: 'Anonymous', iconURL: ctx.guild.iconURL() })
      .setDescription(`🔸${content}`)
      .setTimestamp()

      await ctx.interaction.reply({ content: 'Your vent is being sent!', ephemeral: true });

      const response = await ctx.interaction.channel.send({
        embeds: [ventEmbed],
        // components: [reportRow],
        ephemeral: false,
        fetchReply: true
      });

    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.interaction.reply({ content: '⚠️ Error occurred during vent.', ephemeral: true });
    }
  }
})