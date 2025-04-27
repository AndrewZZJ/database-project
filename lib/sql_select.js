const { withOracleDB } = require('../lib/oracledb_utils')

/*
    Function: fetch ticket purchase history of a customer
    Input: cID
    Output: a list of purchase history, which includes - ticket type (season pass/day pass), purchase date, and valid date.
    Use case: a company IT or a customer tries to search the ticket purchase history. 

    Note: the cID is the id of a customer

    reference SQL query code: (not sure if it's a good idea) 
    SELECT 'DayPass' AS ticket_type, BST.PurchaseDate, DP.ExpiryTime AS valid_date
    FROM BuySellTicket BST
    JOIN DayPass DP ON BST.tID = DP.tID

    UNION

    SELECT 'SeasonPass' AS ticket_type, BST.PurchaseDate, SP.ExpiryDate AS valid_date
    FROM BuySellTicket BST
    JOIN SeasonPass SP ON BST.tID = SP.tID;
*/
async function fetchPurchaseHistory(cID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

/*
    Function: fetch the max id of a table
    Input: table_name, id_name (strings)
    Output: the existing max id (0 if the table is empty)
*/
async function selectMaxID(table_name, id_name) {
    return await withOracleDB(async (connection) => {
        let sql_Query = 'SELECT MAX(';
        sql_Query.concat(id_name, ') FROM ', table_name);
        const result = await connection.execute(sql_Query);
        if (result.rows.length == 0) 
            return 0;
        else
            return result.rows[0][0];
    }).catch(() => {
        return "Error while retrieving max ID";
    });
}

async function getAllCustomers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT cID, Name FROM CUSTOMER');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// might need some discussion on this, as a new UserAccount table might have some dependencies on origianl Company & Customer tables.
async function getAllCustomers_2() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT id, balance FROM UserAccount WHERE role=2');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

module.exports = {
    fetchPurchaseHistory,
    selectMaxID,
    getAllCustomers,
};