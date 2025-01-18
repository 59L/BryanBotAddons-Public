export default {
    name: "ping",
    LegacyRun(manager, message, args, prefixUsed, commandData) {
      message.channel.send("Pong! 🏓");
    },
    InteractionRun(manager, interaction, commandData) {
      interaction.reply("Pong! 🏓");
    },
  };
  