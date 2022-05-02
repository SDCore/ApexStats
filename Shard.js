const { ShardingManager } = require('discord.js');
const { discord, debug, api } = require('./config.json');

const chalk = require('chalk');
const { AutoPoster } = require('topgg-autoposter');

const manager = new ShardingManager('./Apex.js', { token: discord.token, totalShards: discord.shardCount });

manager.on('shardCreate', shard => {
	console.log(chalk`{yellow.bold [> Launching Shard...]}`);
	console.log(chalk`{green.bold [> Shard #${shard.id + 1} Launched]}`);
});

if (debug.true == false) {
	const poster = AutoPoster(api.topgg, manager);

	poster.on('posted', stats => {
		console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
	});
}

manager.spawn();
