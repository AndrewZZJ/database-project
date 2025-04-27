// AJ:
// 2 types of DELETE in SQL: delete a tuple of a table, delete all records of a schema.
// also leave dropping tables (delete tables) here. . 

const { withOracleDB } = require('../lib/oracledb_utils')
const { tableInitMap } = require('../lib/tables_init')
// a missing Buy_Sell_Lesson table for it? 
async function deleteLessonTransaction(lID) {
    
}

/*
CREATE TABLE BuysLesson(
cID INTEGER,
lID INTEGER,
PRIMARY KEY (cID, lID),
FOREIGN KEY (cID) REFERENCES Customer (cID),
FOREIGN KEY (lID) REFERENCES Teaches_Lesson (lID))
*/
// AJ: we might miss a Buy_Sel_Lesson table for the application.
async function deleteLessonBought(cID, lID) {
    // await deleteLessonTransaction(tID);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM BuysLesson WHERE cID=:cID AND lID=:lID`,
            [cID, lID],
            {autoCommit: true}
        );  

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/*CREATE TABLE Buy_Sell_Ticket(
    tID INTEGER,
    PurchaseDate DATETIME,
    cID INTEGER,
    companyName VARCHAR(20),
    PRIMARY KEY (tID),
    FOREIGN KEY (cID) REFERENCES Customer (cID),
    FOREIGN KEY (companyName) REFERENCES Company(Name))
*/
async function deleteTicketTransaction(tID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Buy_Sell_Ticket WHERE tID=:tID`,
            [tID],
            {autoCommit: true}
        );  

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/*
CREATE TABLE BuysTicket(
cID INTEGER,
tID:INTEGER,
PRIMARY KEY (cID, tID),
FOREIGN KEY (cID) REFERENCES Customer (cID),
FOREIGN KEY (tID) REFERENCES Buy_Sell_Ticket (tID))
*/
// AJ: call this method, and it should delte relating tuples in both BuysTicket and Buy_Sell_Ticket.
async function deleteTicketBought(cID, tID) {
    await deleteTicketTransaction(tID);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM BuysTicket WHERE cID=:cID AND tID=:tID`,
            [cID, tID],
            {autoCommit: true}
        );  

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function dropAllTables2() {
    return await withOracleDB(async (connection) => {
        for (const table of Object.keys(tableInitMap)) {
            try {
                await connection.execute(`
                    BEGIN
                        EXECUTE IMMEDIATE 'PURGE RECYCLEBIN';
                        EXECUTE IMMEDIATE 'DROP TABLE ' || :tableName || ' CASCADE CONSTRAINTS';
                    EXCEPTION
                        WHEN OTHERS THEN
                            IF SQLCODE != -942 THEN -- ORA-00942: table or view does not exist
                                RAISE;
                            END IF;
                    END;
                `,{ tableName: table }
                );
                console.warn(`Dropped table: ${table}`);
            } catch (error) {
                console.error(`Error dropping ${table} table: ${error.message}`);
            }
        }
    });
}

async function dropAllTables() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Company`);
        } catch(err) {
            console.log('Errors while dropping Company table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Instructor`);
        } catch(err) {
            console.log('Errors while dropping Instructor table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Level_Price`);
        } catch(err) {
            console.log('Errors while dropping Level_Price table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Teaches_Lesson`);
        } catch(err) {
            console.log('Errors while dropping Teaches_Lesson table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Customer`);
        } catch(err) {
            console.log('Errors while dropping Customer table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Company_Price`);
        } catch(err) {
            console.log('Errors while dropping Company_Price table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Buy_Sell_Ticket`);
        } catch(err) {
            console.log('Errors while dropping Buy_Sell_Ticket table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE DayPass`);
        } catch(err) {
            console.log('Errors while dropping DayPass table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE SeasonPass`);
        } catch(err) {
            console.log('Errors while dropping SeasonPass table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Owns_Mountain`);
        } catch(err) {
            console.log('Errors while dropping Owns_Mountain table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Edge`);
        } catch(err) {
            console.log('Errors while dropping Edge table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Run`);
        } catch(err) {
            console.log('Errors while dropping Run table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Lift`);
        } catch(err) {
            console.log('Errors while dropping Lift table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Has_Node`);
        } catch(err) {
            console.log('Errors while dropping Has_Node table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Village`);
        } catch(err) {
            console.log('Errors while dropping Village table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Service`);
        } catch(err) {
            console.log('Errors while dropping Service table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Has_Review_Left`);
        } catch(err) {
            console.log('Errors while dropping Has_Review_Left table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE Hires`);
        } catch(err) {
            console.log('Errors while dropping Hires table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE BuysLesson`);
        } catch(err) {
            console.log('Errors while dropping BuysLesson table: ' + err.message);
        }
        try {
            await connection.execute(`DROP TABLE BuysTicket`);
        } catch(err) {
            console.log('Errors while dropping BuysTicket table: ' + err.message);
        }

        try {
            await connection.execute(`DROP TABLE UserAccount`);
        } catch(err) {
            console.log('Errors while dropping UserAccount table: ' + err.message);
        }
        // try {
        //     await connection.execute(`DROP TABLE Buy_Sell_Lesson`);
        // } catch(err) {
        //     console.log('Errors while dropping Buy_Sell_Lesson table: ' + err.message);
        // }

        return true;
    }).catch(() => {
        return false;
    })
}

module.exports = {
    deleteLessonBought,
    deleteTicketBought,
    dropAllTables,
    dropAllTables2
};