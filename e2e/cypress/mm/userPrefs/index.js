// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import user from '../api/user';
import theme from '../../fixtures/theme.json';

/**
 * Saves channel display mode preference of a user directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} value - Either "full" (default) or "centered"
 */
function saveChannelDisplayMode(value = 'full') {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'channel_display_mode',
            value,
        };

        user.saveUserPreference([preference]);
    });
}

/**
 * Saves message display preference of a user directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} value - Either "clean" (default) or "compact"
 */
function saveMessageDisplay(value = 'clean') {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'message_display',
            value,
        };

        user.saveUserPreference([preference]);
    });
}

/**
 * Saves teammate name display preference of a user directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} value - Either "username" (default), "nickname_full_name" or "full_name"
 */
function saveTeammateNameDisplay(value = 'username') {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'display_settings',
            name: 'name_format',
            value,
        };

        user.saveUserPreference([preference]);
    });
}

/**
 * Saves theme preference of a user directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {Object} value - theme object.  Will pass default value if none is provided.
 */
function saveTheme(value = JSON.stringify(theme.default)) {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const preference = {
            user_id: cookie.value,
            category: 'theme',
            name: '',
            value,
        };

        user.saveUserPreference([preference]);
    });
}

module.exports = {
    saveChannelDisplayMode,
    saveMessageDisplay,
    saveTeammateNameDisplay,
    saveTheme,
};