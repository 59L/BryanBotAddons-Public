import addon from "./index.js"
import Utils from "../../../src/Modules/Utils.js";

const run = async (manager) => {
  const { config } = addon.addonConfigs
  if (config.Enabled) Utils.logger.info("prefix{cyan{FetchConfig}} is disabled in config!")
  else Utils.logger.info("prefix{cyan{FetchConfig}} " + config.LogMessage)

  Utils.logger.debug("prefix{cyan{FetchConfig}} Logging All Addon Data...")
  Utils.logger.debug(`${JSON.stringify(addon, " ", 2)}`)


}
export default run