import { SlashCommandBuilder } from "discord.js";
const print = new SlashCommandBuilder()
    .setName("print")
    .setDescription("it will print the statement")
    .addStringOption((option) =>
        option
            .setName("statement")
            .setDescription("print the statement")
            .setRequired(true)
    );

export default print.toJSON()