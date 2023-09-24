import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import types from "./commands/type.js";
import roleCommand from "./commands/roles.js";

// Load environment variables from the .env <file></file>
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

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand) {
    // console.log(interaction);
    interaction.options.get("query") &&
      interaction.reply({ content: interaction.options.get("query").value });
    interaction.options.get("here") &&
      interaction.reply({ content: interaction.options.get("here").value });
    interaction.options.get("appreciation") &&
      interaction.reply({
        content: interaction.options.get("appreciation").value,
      });
  }
});

const main = async () => {
  const commands = [
    {
      name: "appreciation",
      description: "it will appreciate you",
      options: [
        //put options here
        {
          name: "appreciation",
          description: "choose from options",
          type: 3,
          required: true,
          //put choices here
          choices: [
            {
              name: "appreciation english",
              value: "Great work",
            },
            {
              name: "appreciation hindi",
              value: "kya baat hai 👏",
            },
          ],
        },
      ],
    },
    {
      name: "print",
      description: "it will print the query",
      options: [
        //put options here
        {
          name: "query",
          description: "give query here",
          type: 3,
          required: true,
        },
      ],
    },
    types,
    roleCommand,
  ];

  try {
    console.log("Started refreshing application ( / ) commands. ");
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(error);
  }
};
main();
