import { Command } from "../../../src/Modules/Structures/Handlers/Commands.js";
import { Addon } from "../../../src/Modules/Structures/Handlers/Addons.js";
import Utils from "../../../src/Modules/Utils.js";
import chalk from "chalk";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsDir = path.resolve(__dirname, "./Commands");

// Define the addon and its configuration
const addon = new Addon("MyBasics", "v1.1.1");
const addonConfig = {
  commands: {
    Ping: {
      Enabled: true,
      Name: "ping",
      Usage: "ping",
      Cooldown: 0,
      Permission: ["@everyone"],
      Description: "View the ping of BryanBot.",
      DeleteCommand: true,
      Arguments: [],
    },
  },
};

// Destructure the custom configuration for ease of use
/** @type {addonConfig} */
const { commands } = addon.customConfig(addonConfig);

// Set up the addon's logging
addon.setLog(`bold{BasicUtils} has been loaded! Version: bold{v1.0}`);

// Define the addon's execution logic
addon.setExecute(async (manager) => {
  const start = Date.now()
  fs.readdir(commandsDir, (err, files) => {
    if (err) {
      console.error(`Error reading commands directory: ${err.message}`);
      return;
    }


    files
      .filter((file) => file.endsWith(".js")) // Process only .js files
      .forEach(async (file) => {
        try {
          const { default: commandModule } = await import(`file://` + path.join(commandsDir, file));

          const { name: CommandName, LegacyRun, InteractionRun } = commandModule;
          const configCommandName = CommandName ? Object.keys(commands).find(c => c.toLowerCase() === CommandName) : undefined
          if (!CommandName || !configCommandName) {
            console.warn(`No valid commandName or config found for ${file}. Skipping...`);
            return;
          }

          const commandData = commands[configCommandName]
          new Command({
            commandData,
            commandConfig: {
              guildOnly: commandData.guildOnly || false,
              dmOnly: commandData.dmOnly || false,
              requiredPermissions: {
                bot: commandData.requiredPermissions?.bot || [],
                user: commandData.requiredPermissions?.user || [],
              },
            },
            LegacyRun(manager, message, args, prefixUsed, commandData) {
              if (typeof LegacyRun === "function") {
                LegacyRun(manager, message, args, prefixUsed, commandData);
              } else {
                console.warn(`LegacyRun not defined for ${file}`);
              }
            },
            InteractionRun(manager, interaction, commandData) {
              if (typeof InteractionRun === "function") {
                InteractionRun(manager, interaction, commandData);
              } else {
                console.warn(`InteractionRun not defined for ${file}`);
              }
            },
          });

          Utils.logger.addon(`green{[cyan{MyBasics}]} loaded the command greenBright{${CommandName}} in ${Math.floor(Date.now() - start) / 1000} second(s).`)
        } catch (err) {
          console.error(`Error loading command file ${file}: ${err.message}`);
        }
      })
  })
});

// Export the addon for use
export default addon;
