// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

describe('my outer describe', () => {
    beforeEach(() => {
        cy.log('INSIDE the before hook');
    });

    afterEach(() => {
        cy.log('AFTER');
    });

    it('1 test', {testId: 'TMFJ-T136'}, () => {
        cy.log('this is the 1 test');
        throw new Error('oops in test');
    });

    it('2 test', {testId: 'TMFJ-T137'}, () => {
        cy.log('this is test 2');
    });

    // describe('inner describe', () => {
    //     beforeEach(() => {
    //         cy.log('inside the INNER before hook');
    //     });

    //     bobit('2 test', () => {
    //         cy.log('this is the 2 test');
    //     });

    //     bobit('3 test', () => {
    //         cy.log('this is the 3 test');
    //     });

    //     describe('another inner describe', () => {
    //         before(() => {
    //             cy.log('inside the INNER INNER before hook');
    //         });

    //         bobit('4 test', () => {
    //             cy.log('this is the 4 test');
    //         });

    //         bobit('5 test', () => {
    //             cy.log('this is the 5 test');
    //         });
    //     });
    // });
});