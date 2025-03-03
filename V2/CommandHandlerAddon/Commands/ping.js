export default {
    // Name of command in "commands" config
    // Used to fetch commandData such as name, usage, enabled ect.
    name: "ping",
    // Function ran for prefix based commands
    LegacyRun(manager, message, args, prefixUsed, commandData) {
      message.channel.send("Pong! 🏓");
    },
    // Function ran for interaction based commands
    InteractionRun(manager, interaction, commandData) {
      interaction.reply("Pong! 🏓");
    },
  };
  