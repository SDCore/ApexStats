const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { api } = require('../../config.json');
const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('hardcoreroyale').setDescription('Shows the current in-game Hardcore Royale map.'),
	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading current in-game Hardcore Royale map...`).setColor('2F3136');

		await interaction.editReply({ embeds: [loadingEmbed] });

		function isPlural(number, word) {
			if (number != 1) return `${word}s`;

			return word;
		}

		function mapLength(minutes) {
			if (minutes >= 60) {
				const hrs = Math.floor(minutes / 60);
				const mins = minutes % 60;

				return `${hrs} ${isPlural(hrs, 'hour')}, ${mins} ${isPlural(mins, 'minute')}`;
			} else {
				return `${minutes} ${isPlural(minutes, 'minute')}`;
			}
		}

		await axios
			.get(`https://api.mozambiquehe.re/maprotation?version=5&auth=${api.apex}`)
			.then(response => {
				const hardcore = response.data.ltm;

				const mapEmbed = new EmbedBuilder()
					.setTitle(`Legends are currently dropping into **${hardcore.current.map}**.`)
					.setDescription(
						`${hardcore.current.map} ends <t:${hardcore.current.end}:R>, or at <t:${hardcore.current.end}:t>.\n**Next up:** ${hardcore.next.map} for ${mapLength(
							hardcore.next.DurationInMinutes,
						)}.`,
					)
					.setColor('2F3136')
					.setImage(`https://cdn.jumpmaster.xyz/Bot/Maps/Season%2015/Battle%20Royale/${encodeURIComponent(hardcore.current.map)}.png`);

				interaction.editReply({ embeds: [mapEmbed] });
			})
			.catch(error => {
				// Request failed with a response outside of the 2xx range
				if (error.response) {
					console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);

					interaction.editReply({ content: `**Error**\n\`${error.response.data.error}\``, embeds: [] });
				} else if (error.request) {
					console.log(error.request);
					interaction.editReply({
						content: `**Error**\n\`The request was not returned successfully.\``,
						embeds: [],
					});
				} else {
					console.log(error.message);
					interaction.editReply({
						content: `**Error**\n\`Unknown. Try again or tell SDCore#0001.\``,
						embeds: [],
					});
				}
			});
	},
};
