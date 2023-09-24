import {SlashCommandBuilder} from "@discordjs/builders"
const types = new SlashCommandBuilder()
  .setName("type")
  .setDescription("type anything")
  .addStringOption((option) =>
    option.setName("here").setDescription("typeanything").setChoices(
      {
        name: "choice1",
        value: "value1",
      },
      {
        name: "choice2",
        value: "value2",
      }
    )
  );
  export default types.toJSON()