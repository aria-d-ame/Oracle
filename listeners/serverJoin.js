const { Listener } = require("gcommands");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// Listener to check if user joined the server and send a welcome message with png attachment
new Listener({
	name: "Server Welcome",
	event: "guildMemberAdd",
	run: async (ctx) => {
		if (ctx.user.bot) return;

		try {
			const welcomeChannel = await ctx.guild.channels.fetch('1329847303888048138');
			const levelZeroRole = await ctx.guild.roles.cache.get('1269693621536423949');

			const joinEmbed = new EmbedBuilder()
				.setTitle(`🔸${ctx.user.username} has opened the ${ctx.guild.name}!`)
				.setColor(0xE67E22)
				.setThumbnail(ctx.displayAvatarURL())
				.setTimestamp()
				.setFooter({
					text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
					iconURL: ctx.guild.iconURL() // Optional: Server icon URL
				})

				const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Write your intro!')
						.setStyle(ButtonStyle.Link)
						.setURL('https://discord.com/channels/1329818096567062651/1329923279267430483')
						.setEmoji('✏️'),
					new ButtonBuilder()
						.setLabel('Check the rules!')
						.setStyle(ButtonStyle.Link)
						.setURL('https://discord.com/channels/1329818096567062651/1329847199198351480')
						.setEmoji('📖'),
				);

			await welcomeChannel.send({
				embeds: [joinEmbed],
				components: [row],
			});

		} catch (error) {
			console.log(error);
		}
	},
});