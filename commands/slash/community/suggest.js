const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'suggest',
  description: 'Make a suggestion!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'suggestion',
      description: 'What is your suggestion?',
      type: ArgumentType.STRING,
      required: true
    }),
  ],

  run: async (ctx) => {
    try{
      const user = ctx.user;
      const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });
      const suggestion = ctx.arguments.getString('suggestion');

      const suggestEmbed = new EmbedBuilder()
      .setColor(0xE67E22)
      .setTitle(`🔸SUGGESTION🔸`)
      .setAuthor({ name: user.displayName, iconURL: icon })
      .setDescription(`🔸${suggestion}`)
      .setTimestamp()
      .setFooter({
        text: `Vote using the emojis below!`, 
        iconURL: ctx.guild.iconURL() 
      })
      const message = await ctx.interaction.reply({ embeds: [suggestEmbed], fetchReply: true });
      await message.react('🟢');
      await message.react('❌');
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.interaction.reply('⚠️ Error occurred during suggestion.');
    }
  }
})