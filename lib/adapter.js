const google = require('googleapis');
let OAuth2 = google.auth.OAuth2;
let gmail = google.gmail('v1');

/**
 *
 */
class Adapter {

    constructor() {
        this.oauth2Client = null;
    }

    /**
     * Adapter method.
     * @param mailOptions
     * @param cb
     * @returns {Promise}
     */
    send(mailOptions, cb) {
        let self = this;
        gmail.users.messages.send({
            userId: "me",
            resource: {
                raw: self._prepareMailData(mailOptions)
            },
            auth: self.oauth2Client
        }, cb);
    }

    /**
     * Custom method.
     * @param options
     */
    setAuthOptions(options) {
        this.oauth2Client = new OAuth2(
            options.clientId,
            options.clientSecret
        );
        this.oauth2Client.setCredentials({
            // access_token: options.accessToken,
            refresh_token: options.refreshToken
        });
    }

    /**
     * Private method.
     * @param mailOptions
     * @returns {String}
     * @private
     */
    _prepareMailData(mailOptions) {
        // RFC 2822
        let email_lines =[];
        if (mailOptions.from) {
            email_lines.push("From:" + mailOptions.from);
        }
        if (mailOptions.to) {
            email_lines.push("To:" + mailOptions.to);
        }
        // text/plain works with \r\n
        // text/html works with <br>
        if (mailOptions.html) {
            email_lines.push('Content-type: text/html;charset=iso-8859-1');
        } else {
            email_lines.push('Content-type: text/plain;charset=iso-8859-1');
        }
        email_lines.push('MIME-Version: 1.0');
        if (mailOptions.subject) {
            email_lines.push("Subject: " + mailOptions.subject);
        }
        email_lines.push("");
        if (mailOptions.html) {
            email_lines.push(mailOptions.html);
        } else {
            email_lines.push(mailOptions.text);
        }
        let email = email_lines.join("\r\n").trim();
        console.log("Mail looks like", email);
        let base64EncodedEmail = new Buffer(email).toString('base64');
        base64EncodedEmail = base64EncodedEmail.replace(/\//g,'_').replace(/\+/g,'-');

        return base64EncodedEmail;
    }
}

module.exports = Adapter;