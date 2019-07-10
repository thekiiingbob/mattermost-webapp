// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import users from '../../../fixtures/users.json';

function create(user) {
    return cy.request({
        method: 'POST',
        url: '/api/v4/users',
        body: {
            email: user.email,
            username: user.username,
            password: user.password,
        },
    }).then((response) => {
        expect(response.status).to.match(/20\d/);
        cy.wrap(response);
    });
}

function login(username = 'user-1', password = null) {
    logout();

    let user;

    if (password) {
        user = {username, password};
    } else {
        user = users[username];
    }

    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/users/login',
        method: 'POST',
        body: {login_id: user.username, password: user.password},
    }).its('status').should('match', /20\d/);
}

function logout() {
    cy.request({
        url: '/api/v4/users/logout',
        method: 'POST',
        log: false,
    }).its('status').should('match', /20\d/);

    ['MMAUTHTOKEN', 'MMUSERID', 'MMCSRF'].forEach((cookie) => {
        cy.clearCookie(cookie);
    });

    cy.getCookies({log: false}).should('be.empty');
}

/**
 * Saves user's preference directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {Array} preference - a list of user's preferences
 */
function saveUserPreference(preferences = [], userId = 'me') {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: `/api/v4/users/${userId}/preferences`,
        method: 'PUT',
        body: preferences,
    }).its('status').should('match', /20\d/);
}

/**
 * Saves channel display mode preference of a user directly via API
 * This API assume that the user is logged in and has cookie to access
 * @param {String} status - "online" (default), "offline", "away" or "dnd"
 */
function updateUserStatus(status = 'online') {
    return cy.getCookie('MMUSERID').then((cookie) => {
        const data = {user_id: cookie.value, status};

        return cy.request({
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            url: '/api/v4/users/me/status',
            method: 'PUT',
            body: data,
        });
    });
}

module.exports = {create, login, logout, saveUserPreference, updateUserStatus};