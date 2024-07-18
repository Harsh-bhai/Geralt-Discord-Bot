import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes, REST } from "discord.js";
import print from "./commands/print.js";
import types from "./commands/type.js";
import roleCommand from "./commands/roles.js";

// Load environment variables from the .env file
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const GUILD_ID = "930001033638322227";

client.on("ready", () => {
  console.log("Bot is ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "print") {
    await interaction.reply({ content: options.getString("statement") });
  } else if (commandName === "type") {
    await interaction.reply({ content: options.getString("type") });
  } else if (commandName === "roles") {
    await interaction.reply({ content: options.getString("roles") });
  }
});

const main = async () => {
  const commands = [print, types, roleCommand];

  try {
    console.log("Started refreshing application ( / ) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully reloaded application ( / ) commands.");
  } catch (error) {
    console.error(error);
  }

  client.login(process.env.TOKEN);
};

main();


