/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var app = require('../app'),
    url = require("url"),
    querystring = require('querystring'),
    Shopify = require('shopify-api-node');

/*
 * Get /
 *
 * if we already have an access token then
 * redirect to render the app, otherwise
 * redirect to app authorisation.
 */
exports.index = function(req, res){
    if (!req.session.oauth_access_token) {
        var parsedUrl = url.parse(req.originalUrl, true);
        if (parsedUrl.query && parsedUrl.query.shop) {
            req.session.shopUrl = 'https://' + parsedUrl.query.shop;
        }

        res.redirect("/auth_app");
    }
    else {
        res.redirect("/render_app");
    }
};

/*
 * Get /render_app
 *
 * render the main app view
 */
exports.renderApp = function(req, res){

    //Get token from session
    var permanentToken = req.session.oauth_access_token;

    //Send token to a class that will return a list of Shopify products
    var shopify = new Shopify( app.nconf.get('general:shop_name'), permanentToken);

    var lastSyncDate = '2014-04-25T16:15:47-04:00';

    shopify.product.list({ created_at_min: lastSyncDate })
        .then(products => console.log(products))
        .catch(err => console.error(err));

    //Send Shopify products to a class that will do the mapping and send those products to platform

    //Get the feedback and send it to the UI to show what was done
    res.render('app_view', {
        title: app.nconf.get('general:title'),
        apiKey: app.nconf.get('oauth:api_key'),
        shopUrl: req.session.shopUrl
    });
};