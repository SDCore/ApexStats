const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('threshold').setDescription('Shows the Apex Predator threshold for PC, PlayStation, and Xbox.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Gathering data for Apex Predator threshold...`);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.apexstats.dev/minPred`)
			.then(response => {
				const data = response.data;

				const season = data.season;
				const PC = data.PC;
				const PS4 = data.PS4;
				const X1 = data.X1;
				const Switch = data.Switch;

				const embed = new MessageEmbed()
					.setTitle(`Apex Predator Threshold for Split ${season.split} of Apex Legends: ${season.name}`)
					.addField(
						'Battle Royale',
						`${Misc.Threshold_PC} PC: ${PC.Battle_Royale.toLocaleString()} RP\n${Misc.Threshold_Xbox} Xbox: ${X1.Battle_Royale.toLocaleString()} RP\n${
							Misc.Threshold_PlayStation
						} PlayStation: ${PS4.Battle_Royale.toLocaleString()} RP\n${Misc.Threshold_Switch} Nintendo Switch: ${Switch.Battle_Royale.toLocaleString()} RP`,
						true,
					)
					.addField(
						'Arenas',
						`${Misc.Threshold_PC} PC: ${PC.Arenas.toLocaleString()} AP\n${Misc.Threshold_Xbox} Xbox: ${X1.Arenas.toLocaleString()} AP\n${
							Misc.Threshold_PlayStation
						} PlayStation: ${PS4.Arenas.toLocaleString()} AP\n${Misc.Threshold_Switch} Nintendo Switch: ${Switch.Arenas.toLocaleString()} AP`,
						true,
					)
					.setFooter({ text: 'Data updated hourly.\nThis is an approximation and may not be entirely accurate.' });

				interaction.editReply({ embeds: [embed] });
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
