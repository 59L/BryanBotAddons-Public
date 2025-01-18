import { Command } from "../../../src/Modules/Structures/Handlers/Commands.js";
import { Addon } from "../../../src/Modules/Structures/Handlers/Addons.js";
import Utils from "../../../src/Modules/Utils.js";
const { logger } = Utils;

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fetch local directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsDir = path.resolve(__dirname, "./Commands");

// Define the addon and its configuration
const addon = new Addon("MyBasics", "v1.0");
// Basic Command Config which stores all data about commands which people can enable and disable.
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

// Set up the addon's logging using the built in chalk system
// Automatically replace colors of chalk without calling the chalk variable. You can also use Utils.logger.<debug, info, warn, error, addon>
addon.setLog(`prefix{cyan{MyBasics}} has been loaded! Version: bold{v1.0}`);

// Declare the developer information according to the addon
addon.setDeveloper("59L") // Declare addon developer (required)
  .setDiscord("https://59l.dev/discord") // Discord to join for support (optional)
  .setDocs("https://59l.dev/docs/mybasics") // Documentation for addon (optional)
  .setAdditional("Thank you for downloading my addon template!\nPlease use me to create many addons for you and your friends!") // Random option to put information for a future addon list cmd to (optional)

// Define the addon's execution logic
// Manager is the entire BryanBot instance. More information can be found on the docs
addon.setExecute(async (manager) => {
  // Saving start time for command load time. Mehh
  const start = Date.now()

  fs.readdir(commandsDir, (err, files) => {
    if (err) {
      logger.error(`prefix{MyBasics} Error reading commands directory: red{${err.message}}`);
      return;
    }

    files
      .filter((file) => file.endsWith(".js")) // Only read js files assuming its a proper cmd
      .forEach(async (file) => {
        try {
          // Import the exported module from the command file.
          const { default: commandModule } = await import(`file://` + path.join(commandsDir, file));

          // Get commandName which is used to fetch command data from config
          // Check if command and configCommand exists
          const { name: CommandName, LegacyRun, InteractionRun } = commandModule;
          const configCommandName = CommandName ? Object.keys(commands).find(c => c.toLowerCase() === CommandName) : undefined
          if (!CommandName || !configCommandName) {
            logger.warn(`prefix{MyBasics} No valid commandName or config found for ${file}. Skipping...`);
            return;
          }

          // create new command using fetched command data
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

          // Finish Command Init
          return logger.addon(`prefix{cyan{MyBasics}} loaded the command greenBright{${CommandName}} in ${Math.floor(Date.now() - start) / 1000} second(s).`)
        } catch (err) {
          logger.error(`prefix{MyBasics} Error loading command file red{${file}}: red{${err.message}}`);
        }
      })
  })
});

// Export the addon for use
export default addon;
