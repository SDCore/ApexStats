const db = require('sqlite3');
const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { debug, api_token } = require('../../config.json');
const { embedColor, Emotes } = require('../../data/utilities.json');
const { getStatus, rankLayout, battlepass, platformName, platformEmote } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder().setName('unlink').setDescription('Unlink your Apex account from your Discord account.'),

	async execute(interaction) {
		// Load DB
		let userDB = new db.Database('./src/database/spyglass.db', db.OPEN_READWRITE, err => {
			if (err) {
				console.error(err.message);
			}
		});

		userDB.run('CREATE TABLE IF NOT EXISTS userLinks(discordID TEXT NOT NULL, playerID TEXT NOT NULL, platform TEXT NOT NULL)');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Loading data for selected account...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		let linkQuery = 'SELECT * FROM userLinks WHERE discordID = ?';

		const discordID = interaction.user.id;

		userDB.get(linkQuery, [discordID], (err, row) => {
			if (err) {
				console.log(err);
				return interaction.editReply({ content: 'There was a database error.', embeds: [] });
			}

			if (row === undefined) {
				// User does not have an account linked
				userDB.close();

				return interaction.editReply({ content: `You do not have a linked account. Use \`/link\` to link an Apex account to your Discord account.`, embeds: [] });
			} else {
				// User already has an account linked
				let deleteUserLink = userDB.prepare(`DELETE FROM userLinks WHERE discordID = ?`);

				deleteUserLink.run(discordID);

				deleteUserLink.finalize();

				userDB.close();

				return interaction.editReply({ content: `You have successfully unlinked your account.`, embeds: [] });
			}
		});
	},
};
