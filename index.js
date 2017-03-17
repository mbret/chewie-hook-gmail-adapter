const nodemailer = require("nodemailer");
const packageInfo = require("./package.json");
const Adapter = require("./lib/adapter");
const google = require('googleapis');

/**
 *
 */
class Hook {

    /**
     * @param chewie
     * @param config
     * @param helper
     * @param options
     */
    constructor(chewie, config, helper, options) {
        this.chewie = chewie;
        this.config = config;
        this.helper = helper;
        this.options = options;
        this.adapter = new Adapter();
    }

    /**
     * @returns {Promise}
     */
    initialize() {
        let self = this;
        this._updateAdapterAuth();

        // listen for user options change
        this.chewie.on("hook:" + packageInfo.name + ":options:updated", function(newOptions) {
            self.helper.logger.verbose("Options have changed!");
            self.options = newOptions;
            self._updateAdapterAuth();
        });

        this.chewie.registerEmailAdapter(this.adapter);

        return Promise.resolve();
    }

    _updateAdapterAuth() {
        this.adapter.setAuthOptions({
            clientId: this.options.clientId,
            clientSecret: this.options.clientSecret,
            refreshToken: this.options.googleRefreshToken,
        });
    }
}

module.exports = Hook;