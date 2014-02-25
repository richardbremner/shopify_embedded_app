/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var app = require('../app'),
    OAuth = require('oauth').OAuth2,
    url = require("url");

exports.AppAuth = function() {
    var self = this;

    /*
     * Get /auth_app
     *
     * initiates the Shopify App authorisation
     */
    this.initAuth = function(req, res){
        if (!req.session.oauth_access_token) {
            res.redirect("/escape_iframe");
        } else {
            res.redirect("/render_app");
        }
    };

    /*
     * Get /escape_iframe
     *
     * renders a view that contains javascript
     * which will change the browser top window
     * location to start the oauth process
     *
     * See http://docs.shopify.com/embedded-app-sdk/getting-started#oauth
     */
    this.escapeIframe = function(req, res) {
        res.render('escape_iframe');
    };

    /*
     * Get /auth_code
     *
     * gets the temporary token which we can exchange
     * for a permanent token. User may be prompted to accept
     * the scope being requested
     */
    this.getCode = function(req, res) {
        var redirectUrl = self.OAuth(req.session.shopUrl).getAuthorizeUrl({
            redirect_uri : app.nconf.get('oauth:redirect_url'),
            scope: app.nconf.get('oauth:scope')
        });
        res.redirect(redirectUrl);
    };

    /*
     * Get /auth_token
     *
     * get the permanent access token which is valid
     * for the lifetime of the app install, it does
     * not expire
     */
    this.getAccessToken = function(req, res) {
        var parsedUrl= url.parse(req.originalUrl, true);

        self.OAuth(req.session.shopUrl).getOAuthAccessToken(
            parsedUrl.query.code, {},
            function(error, access_token, refresh_token) {
                if (error) {
                    res.send(500);
                    return;
                } else {
                    req.session.oauth_access_token = access_token;
                    res.redirect("/render_app");
                }
            }
        );
    };

    this.OAuth = function(shopUrl) {
        return new OAuth(
            app.nconf.get('oauth:api_key'),
            app.nconf.get('oauth:client_secret'),
            shopUrl,
            "/admin/oauth/authorize",
            "/admin/oauth/access_token");
    }
}