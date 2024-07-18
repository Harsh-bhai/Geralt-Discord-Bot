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

const deleteGuildCommands = async (guildId) => {
  try {
    const guildCommands = await rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId));
    console.log(`Found ${guildCommands.length} guild-specific commands.`);
    
    const promises = guildCommands.map((command) => {
      console.log(`Deleting guild command ${command.name}`);
      return rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, guildId, command.id));
    });
    
    await Promise.all(promises);
    console.log("Successfully deleted all guild-specific commands.");
  } catch (error) {
    console.error("Error deleting guild-specific commands:", error);
  }
};

const deleteGlobalCommands = async () => {
  try {
    const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
    console.log(`Found ${globalCommands.length} global commands.`);
    
    const promises = globalCommands.map((command) => {
      console.log(`Deleting global command ${command.name}`);
      return rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command.id));
    });
    
    await Promise.all(promises);
    console.log("Successfully deleted all global commands.");
  } catch (error) {
    console.error("Error deleting global commands:", error);
  }
};

const registerCommands = async (commands) => {
  try {
    console.log("Started refreshing application ( / ) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully reloaded application ( / ) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
};

const main = async () => {
  const commands = [print, types, roleCommand];

  await deleteGlobalCommands(); // Delete all global commands
  await deleteGuildCommands("930001033638322227"); // Delete all guild-specific commands for the specified guild

  await registerCommands(commands); // Register new commands

  client.login(process.env.TOKEN);
};

main();

// print command
import { SlashCommandBuilder } from "discord.js";
const print = new SlashCommandBuilder()
  .setName("print")
  .setDescription("it will print the statement")
  .addStringOption((option) =>
    option.setName("statement").setDescription("print the statement").setRequired(true)
  );

export default print.toJSON();
