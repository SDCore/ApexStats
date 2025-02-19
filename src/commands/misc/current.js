const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { Misc, embedColor } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('current').setDescription('Information about the current season.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading current season data...`);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2').then(response => {
			const season = response.data;

			const currentSeason = new EmbedBuilder()
				.setTitle(`Apex Legends: ${season.info.title}`)
				.setURL(season.info.data.url)
				.setDescription(season.info.description)
				.addFields(
					{
						name: 'Season Start Date',
						value: `<t:${season.dates.start.timestamp}:D>\n<t:${season.dates.start.timestamp}:t>\n<t:${season.dates.start.timestamp}:R>`,
						inline: true,
					},
					{
						name: 'Season Split Date',
						value: `<t:${season.dates.split.timestamp}:D>\n<t:${season.dates.split.timestamp}:t>\n<t:${season.dates.split.timestamp}:R>`,
						inline: true,
					},
					{
						name: '\u200b',
						value: `\u200b`,
						inline: true,
					},
					{
						name: 'Ranked End Date',
						value: `<t:${season.dates.end.rankedEnd}:D>\n<t:${season.dates.end.rankedEnd}:t>\n<t:${season.dates.end.rankedEnd}:R>`,
						inline: true,
					},
					{
						name: 'Season End Date',
						value: `<t:${season.dates.end.timestamp}:D>\n<t:${season.dates.end.timestamp}:t>\n<t:${season.dates.end.timestamp}:R>`,
						inline: true,
					},
					{
						name: '\u200b',
						value: `\u200b`,
						inline: true,
					},
				)

				// .setImage(`${encodeURI(season.info.data.image)}?t=${Math.floor(Math.random() * 10) + 1}`)
				.setImage(`https://specter.apexstats.dev/ApexStats/Maps/${season.info.data.image}.png?t=${Math.floor(Math.random() * 10) + 1}&key=${process.env.SPECTER}`)
				.setFooter({
					text: season.info.data.tagline,
					iconURL: `https://specter.apexstats.dev/ApexStats/Avatar/${encodeURIComponent(season.info.title)}.png?t=${Math.floor(Math.random() * 10) + 1}&key=${process.env.SPECTER}`,
				});

			interaction.editReply({ embeds: [currentSeason] });
		});
	},
};
