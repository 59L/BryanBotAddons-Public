import { Command } from "../../../src/Modules/Structures/Handlers/Commands.js";
import { Addon } from "../../../src/Modules/Structures/Handlers/Addons.js";
import Utils from "../../../src/Modules/Utils.js";
const { logger } = Utils;

import helper from "./helper.js"


// Define the addon and its configuration
const addon = new Addon("FetchConfig", "v1.0");
// Basic Config which stores all data for addon
const addonConfig = {
  config: {
    Enabled: true,
    LogMessage: "Hello! This is being logged in worker file and not the main addon!"
  }
};

// Set up the addon's logging using the built in chalk system
// Automatically replace colors of chalk without calling the chalk variable. You can also use Utils.logger.<debug, info, warn, error, addon>
addon.setLog(`prefix{cyan{FetchConfig}} has been loaded! Version: bold{v1.0}`);

// Declare the developer information according to the addon
addon.setDeveloper("59L") // Declare addon developer (required)
  .setDiscord("https://59l.dev/discord") // Discord to join for support (optional)
  .setDocs("https://59l.dev/docs/FetchConfig") // Documentation for addon (optional)
  .setAdditional("Thank you for downloading my addon template!\nPlease use me to create many addons for you and your friends!") // Random option to put information for a future addon list cmd to (optional)

// Define the addon's execution logic
// Manager is the entire BryanBot instance. More information can be found on the docs
addon.setExecute(helper)

// Export the addon for use
export default addon;
