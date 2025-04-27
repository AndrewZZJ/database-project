// Mar 27, 2025 - Jenna C.
// initiation of all tables

const oracledb = require('oracledb');
const { withOracleDB } = require('../lib/oracledb_utils')

async function initiateCompany() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Company`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Company (
                Name VARCHAR(60) PRIMARY KEY,
                Email VARCHAR(30) NOT NULL UNIQUE,
                Phone VARCHAR(15) NOT NULL UNIQUE,
                Address VARCHAR(100) NOT NULL UNIQUE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateInstructor() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Instructor`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Instructor (
                iID INTEGER PRIMARY KEY,
                Name VARCHAR(20) NOT NULL,
                Email VARCHAR(30),
                Phone VARCHAR(15) NOT NULL)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateLevelPrice() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Level_Price`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Level_Price (
                "LEVEL" INTEGER PRIMARY KEY,
                Price FLOAT)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateTeachesLesson() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Teaches_Lesson`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Teaches_Lesson (
                lID INTEGER,
                iID INTEGER,
                "LEVEL" INTEGER,
                DateTime DATE,
                PRIMARY KEY (lID),
                FOREIGN KEY (iID) REFERENCES Instructor(iID),
                FOREIGN KEY ("LEVEL") REFERENCES Level_Price("LEVEL") ON DELETE CASCADE)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateCustomer() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Customer`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Customer (
                cID INTEGER PRIMARY KEY,
                Name VARCHAR(20) NOT NULL,
                Age INTEGER,
                SkillLevel INTEGER NOT NULL)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateCompanyPrice() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Company_Price`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Company_Price (
                Price FLOAT,
                companyName VARCHAR(60),
                PRIMARY KEY (companyName),
                FOREIGN KEY (companyName) REFERENCES Company(Name))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateBuySellTicket() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Buy_Sell_Ticket`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Buy_Sell_Ticket (
                tID INTEGER PRIMARY KEY,
                PurchaseDate DATE,
                cID INTEGER,
                companyName VARCHAR(60),
                FOREIGN KEY (cID) REFERENCES Customer(cID),
                FOREIGN KEY (companyName) REFERENCES Company(Name))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateDayPass() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DayPass`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DayPass (
                tID INTEGER,
                ExpiryTime DATE,
                PRIMARY KEY (tID),
                FOREIGN KEY (tID) REFERENCES Buy_Sell_Ticket(tID))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateSeasonPass() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE SeasonPass`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE SeasonPass(
                tID INTEGER PRIMARY KEY,
                ExpiryDate DATE,
                FOREIGN KEY (tID) REFERENCES Buy_Sell_Ticket(tID))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateOwnsMountain() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Owns_Mountain`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Owns_Mountain(
                Address VARCHAR(100) PRIMARY KEY,
                Capacity INTEGER,
                Name VARCHAR(60) NOT NULL,
                companyName VARCHAR(60) NOT NULL,
                FOREIGN KEY (companyName) REFERENCES Company(name))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateEdge() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Edge`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Edge (
                eID INTEGER PRIMARY KEY,
                beginNodeID INTEGER NOT NULL,
                endNodeID INTEGER NOT NULL,
                StartTime DATE NOT NULL,
                EndTime DATE NOT NULL,
                length FLOAT,
                FOREIGN KEY (beginNodeID) REFERENCES Has_Node(nID),
                FOREIGN KEY (endNodeID) REFERENCES Has_Node(nID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateRun() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Run`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Run (
                eID INTEGER PRIMARY KEY,
                Difficulty INTEGER NOT NULL,
                FOREIGN KEY (eID) REFERENCES Edge(eID))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Lift tables
async function initiateLiftCapacity() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Lift_Capacity`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE LiftCapacity (
                Type VARCHAR(20) PRIMARY KEY,
                Capacity INTEGER NOT NULL)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateLiftType() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE LiftType`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE LiftType (
                eID INTEGER PRIMARY KEY,
                Type VARCHAR(20) NOT NULL,
                FOREIGN KEY (eID) REFERENCES Edge(eID),
                FOREIGN KEY (Type) REFERENCES LiftCapacity(Type))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}



async function initiateHasNode() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE HAS_NODE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Has_Node (
                nID INTEGER PRIMARY KEY,
                elevation FLOAT NOT NULL,
                xCoord FLOAT NOT NULL,
                yCoord FLOAT NOT NULL,
                mountainAddress VARCHAR(100) NOT NULL,
                UNIQUE(xCoord, yCoord),
                FOREIGN KEY (mountainAddress) REFERENCES Owns_Mountain(Address))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateVillage() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Village`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Village (
                nID INTEGER PRIMARY KEY,
                Name VARCHAR(20) NOT NULL,
                FOREIGN KEY (nID) REFERENCES Has_Node(nID))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateService() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Service`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Service (
                nID INTEGER,
                Type VARCHAR(20),
                StartTime DATE NOT NULL,
                EndTime DATE NOT NULL,
                PRIMARY KEY (nID, Type),
                FOREIGN KEY (nID) REFERENCES Has_Node(nID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Has_Review_Left tables
async function initiateReviewContent() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE ReviewContent`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE ReviewContent(
                cID INTEGER,
                DateTime DATE,
                Score FLOAT NOT NULL,
                Comments VARCHAR(300),
                PRIMARY KEY (cID, DateTime),
                FOREIGN KEY (cID) REFERENCES Customer(cID))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateReview() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Review`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Review(
                rID INTEGER PRIMARY KEY,
                eID INTEGER NOT NULL,
                cID INTEGER NOT NULL,
                DateTime DATE NOT NULL,
                FOREIGN KEY (eID) REFERENCES Edge(eID),
                FOREIGN KEY (cID, DateTime) REFERENCES ReviewContent(cID,DateTime)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}



async function initiateHires() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Hires`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Hires(
                iID INTEGER,
                companyName VARCHAR(60),
                PRIMARY KEY (iID, companyName),
                FOREIGN KEY (iID) REFERENCES Instructor(iID),
                FOREIGN KEY (companyName) REFERENCES Company(Name)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateBuysLesson() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE BuysLesson`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE BuysLesson(
                cID INTEGER,
                lID INTEGER,
                PRIMARY KEY (cID, lID),
                FOREIGN KEY (cID) REFERENCES Customer (cID),
                FOREIGN KEY (lID) REFERENCES Teaches_Lesson (lID))
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// This table should not exist
// async function initiateBuysTicket() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE Buys_Ticket`);
//         } catch (err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE BuysTicket(
//                 cID INTEGER,
//                 tID:INTEGER,
//                 PRIMARY KEY (cID, tID),
//                 FOREIGN KEY (cID) REFERENCES Customer (cID),
//                 FOREIGN KEY (tID) REFERENCES Buy_Sell_Ticket (tID))
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

async function initiateUserAccount() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE UserAccount`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        try {
            const result = await connection.execute(`
                CREATE TABLE UserAccount (
                    account VARCHAR2(20) PRIMARY KEY,
                    password VARCHAR2(20) NOT NULL,
                    role VARCHAR2(20) NOT NULL,
                    balance INTEGER DEFAULT 0
                )
            `);
            console.log('UserAccount table created');
            await connection.commit();
            return true;
        } catch (err) {
            console.error('Create table error:', err);
            await connection.rollback();
            throw err;
        }
    }).catch((err) => {
        console.error('Database operation failed:', err);
        return false;
    });
}

const tableInitMap = {
    'Company':          initiateCompany, 
    'Instructor':       initiateInstructor,
    'Level_Price':      initiateLevelPrice, 
    'Teaches_Lesson':   initiateTeachesLesson, 
    'Customer':         initiateCustomer, 
    'Company_Price':    initiateCompanyPrice, 
    'Buy_Sell_Ticket':  initiateBuySellTicket, 
    'DayPass':          initiateDayPass,
    'SeasonPass':       initiateSeasonPass,
    'Owns_Mountain':    initiateOwnsMountain, 
    'Has_Node':         initiateHasNode,
    'Village':          initiateVillage,
    'Service':          initiateService,
    'Edge':             initiateEdge, 
    'Run':              initiateRun,
    'LiftCapacity':     initiateLiftCapacity,
    'LiftType':         initiateLiftType,
    'ReviewContent':    initiateReviewContent,
    'Review':           initiateReview,
    'Hires':            initiateHires,
    'BuysLesson':       initiateBuysLesson,
    'UserAccount':      initiateUserAccount,
};


module.exports = {
    initiateCompany,
    initiateInstructor,
    initiateLevelPrice,
    initiateTeachesLesson,
    initiateCustomer,
    initiateCompanyPrice,
    initiateBuySellTicket,
    initiateDayPass,
    initiateSeasonPass,
    initiateOwnsMountain,
    initiateEdge,
    initiateRun,
    initiateUserAccount,
    initiateBuysLesson,
    initiateRun,
    initiateLiftCapacity,
    initiateLiftType,
    initiateHasNode,
    initiateVillage,
    initiateService,
    initiateReviewContent,
    initiateReview,
    initiateHires,
    initiateBuysLesson,
    tableInitMap,
};