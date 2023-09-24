import { SlashCommandBuilder } from "@discordjs/builders";
const roleCommand = new SlashCommandBuilder()
  .setName("addrole")
  .setDescription("add a role")
  .addRoleOption((option) =>
    option.setName("newrole").setDescription("adding new role")
  );
export default roleCommand.toJSON();
