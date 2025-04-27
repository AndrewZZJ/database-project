const oracledb = require('oracledb');

// const { withOracleDB } = require('../appService')


// AJ: from appService
// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


/*
    Function: fetch login data and check if it's 
    Input: data
    Output: T or F (T -> login successful, F -> show message like 'Invalid email or password')
    Use case: a company IT or a customer tries to login to their account/identity. 

    Note1: not sure if I need to use JS object if I have only 2 parameters....
        the data planned to be a javascript object, which looks like:
        const data = {
            account: fdas,
            password: 1234, 
        };
    Note2: need to build table (Say UserAccount) for account & passwords. 
    Note 3: For the table UserAccount, it looks like: (role -> company or customer) (balance for the money a customer has)
        CREATE TABLE UserAccount (
            id NUMBER PRIMARY KEY,
            account VARCHAR2(20) NOT NULL UNIQUE,
            password VARCHAR2(20) NOT NULL,
            role VARCHAR2(20) NOT NULL,
            balance INTEGER DEFAULT 0
        );
    Note 4: "worst case" -> we have only 1 default company and 1 default customer, so that we don't have to add new table/care about login
*/
async function verifyLoginData(account, password) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT role FROM UserAccount WHERE account = :account AND password = :password',
            [account, password]);

        // not sure if >0 is a good decision here. maybe == 1?
        if (result.rows.length > 0) 
            return result.rows[0][0];
        else 
            return false;
        
    }).catch(() => {
        return [];
    });
}

module.exports = {
    verifyLoginData, 
};