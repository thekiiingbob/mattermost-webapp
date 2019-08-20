// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
const fse = require('fs-extra');
const axios = require('axios');

const resultsJson = require('../results/mochawesome-report/mergedReport.json');

// const resultFiles = fse.readdirSync('results/mochawesome-report/').filter((filename) => {
//     return (/mochawesome-.+\.json/).test(filename);
// });

const resultsToReport = resultsJson.results.map((result) => {
    return result.suites[0].tests.map((test) => {
        // Setup the initial test data object
        const testObject = {title: test.title, state: test.state, executionTime: test.duration, err: test.err};

        // Pull out and parse the context(s) of the test
        // which may include the metadata object
        const contexts = JSON.parse(test.context);

        // If we have a length greater than 1, we are dealing with an array
        if (contexts && contexts.length > 1) {
            // Get the object that is the metadata object
            const metadata = contexts.find((context) => {
                return context.title === 'metadata';
            });

            // Assign metadata values
            testObject.testId = metadata.value.testId || null;
            testObject.tags = metadata.value.tags || null;
        } else if (contexts && contexts.title === 'metadata') {
            // We are now dealig with just a metedata object, so pull out
            // the releevant data, or default to null
            testObject.testId = contexts.value.testId || null;
            testObject.tags = contexts.value.tags || null;
        } else {
            // No metedata is found, so default to null
            testObject.testId = null;
            testObject.tags = null;
        }

        // Finally return the test object
        // return testObject;

        const data = {
            projectKey: 'TMFJ',
            testCaseKey: testObject.testId,
            testCycleKey: 'TMFJ-R9',
            statusName: 'Pass', //testObject.state,
            environmentName: 'Cypress',
            executionTime: testObject.executionTime,

            // executedById: '377441B7-835D-4B08-B7F4-219E9E62C015',
            // assignedTo: 'string',
            // assignedToId: '377441B7-835D-4B08-B7F4-219E9E62C015',
            comment: 'This is my test result comment',
        };

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InV1aWQiOiJvN3Bfb2ZOWmgiLCJhcGlHd0tleSI6ImJ0N0RIaTR1RnozQkdmM3I2ZEJ1cTY1R1FiSjdqSlNPNmViNkxzUUgiLCJiYXNlVXJsIjoiaHR0cHM6Ly9tYXR0ZXJtb3N0LmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjVjZDA2ZjQzNjY3M2M4MGZlMTc1OGE2YiJ9fSwiaWF0IjoxNTY1OTczOTE0LCJleHAiOjE1OTc1MzE1MTQsImlzcyI6ImNvbS5rYW5vYWgudGVzdC1tYW5hZ2VyIiwic3ViIjoiYWQ3MjJjMTUtZTJhNi0zNzg4LTgyZjMtOTJmOTkyMjFmNDQ2In0.Xd1Mf10pQ42EBRaH9v75rxW0CjuRD738jQepMJdLnJ4';

        axios({
            method: 'post',
            url: 'https://api.adaptavist.io/tm4j/v2/testexecutions',
            headers: {Authorization: 'Bearer ' + token},
            data,
        }).then(((response) => {
            console.log('RESULT', response);
        })).catch((error) => {
            console.log('ERROR MAKING REQUEST TO TM4J', error);
        });
    });
});

// console.log(resultsToReport);

// Example POST testResult
// {
//     "projectKey": "TIS",
//     "testCaseKey": "SA-T10",
//     "testCycleKey": "SA-C10",
//     "statusName": "string",
//     "testScriptResults": [
//     {}
//     ],
//     "environmentName": "Chrome Latest Version",
//     "actualEndDate": "2019-08-19T14:15:12Z",
//     "executionTime": 121000,
//     "userKey": "string",
//     "executedById": "377441B7-835D-4B08-B7F4-219E9E62C015",
//     "assignedTo": "string",
//     "assignedToId": "377441B7-835D-4B08-B7F4-219E9E62C015",
//     "comment": "Test passed with no issues. One improvement noticed and covered in new requirement."
//     }

// Access Key
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InV1aWQiOiJvN3Bfb2ZOWmgiLCJhcGlHd0tleSI6ImJ0N0RIaTR1RnozQkdmM3I2ZEJ1cTY1R1FiSjdqSlNPNmViNkxzUUgiLCJiYXNlVXJsIjoiaHR0cHM6Ly9tYXR0ZXJtb3N0LmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjVjZDA2ZjQzNjY3M2M4MGZlMTc1OGE2YiJ9fSwiaWF0IjoxNTY1OTczOTE0LCJleHAiOjE1OTc1MzE1MTQsImlzcyI6ImNvbS5rYW5vYWgudGVzdC1tYW5hZ2VyIiwic3ViIjoiYWQ3MjJjMTUtZTJhNi0zNzg4LTgyZjMtOTJmOTkyMjFmNDQ2In0.Xd1Mf10pQ42EBRaH9v75rxW0CjuRD738jQepMJdLnJ4

// Key ID
// o7p_ofNZh