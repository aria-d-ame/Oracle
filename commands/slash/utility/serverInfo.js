const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'serverinfo',
  description: 'Get information about this server!',
  type: [CommandType.SLASH],

  run: async (ctx) => {
    try{
      const {guild} = ctx;
      const { members } = guild;
      const { name, ownerId, createdTimestamp, memberCount } = guild
      const icon = guild.iconURL() || ''
      const roles = guild.roles.cache.size;
      const emojis = guild.emojis.cache.size;
      const id = guild.id;
      const boostCount = guild.premiumSubscriptionCount || 'N/A';
  
  
      const embed = new EmbedBuilder()
      .setColor(0xE67E22)
      .setThumbnail(icon)
      .setAuthor({name: name})
      .setFooter({ text: `ID: ${id}`})
      .setTimestamp()
      .setTitle(`🔸SERVER INFO🔸`)
      .addFields([
        { name: '🔸Server Owner:', value: `🔸<@${ownerId}>`, inline: false },
        { name: '🔸Member Count:', value: `🔸${memberCount}`, inline: true },
        { name: '🔸Boost Count:', value: `🔸${boostCount}`, inline: true },
      ])
      .addFields([
        { name: '🔸Date Created:', value: `🔸<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: false },
        { name: '🔸Role Count:', value: `🔸${roles}`, inline: true },
        { name: '🔸Emote Count:', value: `🔸${emojis}`, inline: true },
      ]);

      await ctx.reply({ embeds: [embed] });
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.reply('⚠️ Error occurred while fetching server information.');
    }
  }
})