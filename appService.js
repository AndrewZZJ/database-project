const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const { initializeConnectionPool, closePoolAndExit, withOracleDB } = require('./lib/oracledb_utils');
const envVariables = loadEnvFile('./.env');

const insert = require('./lib/sql_insert');
const dropAllTables = require('./lib/sql_delete').dropAllTables2;
const { populateAllTables } = require('./lib/tuplePopulation');

const routing = require('./routing');

var count = {
    'review': 0,
    'ticket': 0,
    'lesson': 0,
    'instructor': 0,
    'company': 0,
    'customer': 0,
};
// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

(async () => {
    await initializeConnectionPool(dbConfig);
})();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);





// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}
//-----------------------------------------------------------
/*
    Function: fetch the booking status of a customer
    Input: id of a customer
    Output: list of the booking status
    Use case: a company IT (put customer id) or a customer (default passing the id of the customer) tries to find the booking status.
*/
async function getAccountStatus(account) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM UserAccount WHERE account = :account',
            [account]);
        return result.rows[0];
    }).catch(() => {
        return null;
    });
}

class User {
    static async isExistingAccount(account) {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                'SELECT * FROM UserAccount WHERE account = (:account)',
                [account]
            );
            // console.log(result);
            return result.rows.length > 0; // true if account exists
        }).catch(() => {
            return false;
        });
    }
    static async signUp(account, password, isCompany) {
        // role: 'customer' or 'company'
        const role = isCompany ? 'company' : 'customer';
        if (await User.isExistingAccount(account)) {
            return false; // Account already exists
        }
        // insert the new account into the database.
        const res = await withOracleDB(async (connection) => {
            // should move to sql_insert
            const result = await connection.execute(
                `INSERT INTO UserAccount (account, password, role) 
                VALUES (:account, :password, :role)`,
                [account, password, role],
                { autoCommit: true }
            );
            return result.rowsAffected && result.rowsAffected > 0;
        }
        ).catch(() => {
            return false;
        });
        return true;
    }

    static async signIn(account, password) {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(`
                SELECT role FROM UserAccount
                WHERE account = :account AND password = :password
                `, [account, password]);
            if (result.rows.length > 1) {
                throw new Error('Multiple accounts found with the same credentials');
            }
            if (result.rows.length == 1)
                return result.rows[0][0]; // return the type of the user (customer or company)
            else
                return false;
        }).catch(() => {
            return false;
        });
    }
    static async getAllLessons(instructorID = null) {
        // get lessons available of all mountains
        // filter the lessons if mountain, or instructor are not null
        // otherwise, return all lessons
        // Teaches_Lesson(lID, iID, Level, Price, DateTime)
        let instructorFilter = instructorID ? ` AND i.iID = :instructorID` : ''
        let query = `
            SELECT t.lID, t."LEVEL", lp.Price, t.dateTime, i.Name
            FROM Teaches_Lesson t, Level_Price lp, Instructor i
            WHERE t.iID = i.iID AND lp."LEVEL" = t."LEVEL"
        `+ instructorFilter;
        // let params = {instructorID:instructorID};
        let params = [instructorID].filter(x => x != null);
        return await withOracleDB(async (connection) => {
            console.debug(query, params);
            const result = await connection.execute(query, params);
            return result.rows;
        }).catch(() => {
            return [];
        });
    }
    static async getAllTickets() {
        // tid, price, companyName, type('Day' or 'Season')
        // Buy_Sell_Ticket(tID, PurchaseDate, cID, companyName )
        // Company(Name, Email, Phone, Address)
        // Customer(cID, Name, Age, skillLevel)
        return await withOracleDB(async (connection) => {
            await connection.execute(`
                BEGIN
                    EXECUTE IMMEDIATE 'DROP VIEW allTickets';
                EXCEPTION
                    WHEN OTHERS THEN
                        IF SQLCODE != -942 THEN -- ORA-00942: table or view does not exist
                            RAISE;
                        END IF;
                END;
                `);
            await connection.execute(`
                CREATE VIEW allTickets(tID, price, companyName) AS
                    SELECT t.tID, cp.Price, t.companyName
                    FROM Buy_Sell_Ticket t, Company_Price cp
                    WHERE t.companyName = cp.companyName 
                
            `);
            const result = await connection.execute(`
                SELECT t.tID, t.price, t.companyName, 'Day'
                FROM allTickets t, DayPass dp
                WHERE t.tID = dp.tID
                UNION ALL
                SELECT t.tID, t.price, t.companyName, 'Season'
                FROM allTickets t, SeasonPass sp
                WHERE t.tID = sp.tID
            `);
            return result.rows;
        }).catch(() => {
            return [];
        });
    }
    static async getTicketsSelling() {
        // tid, price, companyName, type('Day' or 'Season')
        // Buy_Sell_Ticket(tID, PurchaseDate, cID, companyName )
        // Company(Name, Email, Phone, Address)
        // Customer(cID, Name, Age, skillLevel)
        return await withOracleDB(async (connection) => {
            await connection.execute(`
                BEGIN
                    EXECUTE IMMEDIATE 'DROP VIEW allTicketsSelling';
                EXCEPTION
                    WHEN OTHERS THEN
                        IF SQLCODE != -942 THEN -- ORA-00942: table or view does not exist
                            RAISE;
                        END IF;
                END;
                `);
            await connection.execute(`
                CREATE VIEW allTicketsSelling(tID, price, companyName) AS
                    SELECT t.tID, cp.Price, t.companyName
                    FROM Buy_Sell_Ticket t, Company_Price cp
                    WHERE t.companyName = cp.companyName 
                        AND t.purchaseDate IS NULL AND t.cID IS NULL
                
            `);
            const result = await connection.execute(`
                SELECT t.tID, t.price, t.companyName, 'Day'
                FROM allTicketsSelling t, DayPass dp
                WHERE t.tID = dp.tID
                UNION ALL
                SELECT t.tID, t.price, t.companyName, 'Season'
                FROM allTicketsSelling t, SeasonPass sp
                WHERE t.tID = sp.tID
            `);
            return result.rows;
        }).catch(() => {
            return [];
        });
    }

}
class Customer extends User {
    static async signUp(account, password, customerInfo) {
        let res = await super.signUp(account, password, False);
        if (res == false) return false;
        // insert the new customer into the database.
        let res2 = await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `INSERT INTO Customer (cID, Name, Age, SkillLevel) 
                VALUES (:cID, :Name, :Age, :SkillLevel)`,
                [userCount['customer'], customerInfo.Name, customerInfo.Age, customerInfo.SkillLevel],
                { autoCommit: true }
            );
            return result.rowsAffected && result.rowsAffected > 0;
        }).catch(() => {
            return false;
        });
        if (res2 == false) return false;
        userCount['cusomer']++;
        return true;
    }
    static async getBookingStatus(id) {
        return await getBookingStatus();
    }
    static async getLessonsBought(customerID) {
        // Teaches Lesson(lID, Level, Price, DateTime)
        // BuysLesson(cID, lID)
        // Hires(iID, companyName)
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(`
                SELECT t.lID, t.price, t."LEVEL", t.dateTime, i.instructorName
                FROM Teaches_Lesson t, BuysLesson b, Instructor i
                WHERE t.lID = b.lID AND b.cID = :customerID AND i.iID = t.iID
            `, [customerID]
            );
            return result.rows;
        }).catch(() => {
            return [];
        });
    }
    static async getTicketsBought(customerID) {
        return await withOracleDB(async (connection) => {
            // Buy_Sell_Ticket(tID, PurchaseDate, Price, cID, companyName )
            const result = await connection.execute(`
                SELECT t.tID, t.Price, t.companyName
                FROM Buy_Sell_Ticket t, Customer c
                WHERE t.cID = c.cID AND c.cID = :customerID
            `, [customerID]);
            return result.rows;
        }).catch(() => {
            return [];
        });
    }
    static async getPurchaseHistory(customerID) {
        // returns the first 3 rows (id, price, companyName)
        const result = new Array(Customer.getTicketsBought(customerID));
        return result.push(Customer.getLessonsBought(customerID));
    }
    static async buyTicket(customerID, tID, purchaseDate) {
        // TODO: check if the ticket is available for purchase
        // Buy_Sell_Ticket probably shouldn't be normalized
        // since I found it not making sense having company->price when we have two types of tickets.
        // Buy_Sell_Ticket(tID, PurchaseDate, cID, companyName)
        // =>Buy_Sell_Ticket(tID, PurchaseDate, Price, cID, companyName)
        let res = await withOracleDB(async (connection) => {
            const result = await connection.execute(`
                UPDATE Buy_Sell_Ticket 
                SET cID = :customerID, PurchaseDate = :purchaseDate
                WHERE tID = :tID
            `, [customerID, purchaseDate, tID]);
            return result.rowsAffected && result.rowsAffected > 0;
        }).catch(() => {
            return false;
        });
        return res;
    }
    static async buyLesson(customerID, lID) {
        return await withOracleDB(async (connection) => {
            // BuysLesson(cID, lID)
            const result = await connection.execute(`
                INSERT INTO BuysLesson (cID, lID)
            `, [customerID, lID]);
            return result.rowsAffected && result.rowsAffected > 0;
        }).catch(() => {
            return false;
        });
    }
    static async cancelLesson(customerID, lessonID) {
        // AJ:beside of deleting the purchase history in buy_lesson table, 
        // I need to add the lesson price back to the customer.
        let res = await withOracleDB(async (connection) => {
            const result = await connection.execute(`
                DELETE FROM BuysLesson WHERE cID = :customerID AND lID = :lessonID
            `, [customerID, lessonID]);
            return result.rowsAffected && result.rowsAffected > 0;

        }).catch(() => {
            return false;
        });

        refundCustomer(customerID, price);
        return res
    }
    static async leaveRunReview(customerID, edgeID, reviewContent) {
        // Has_Review_Left(rID, cID, eID, Comments, Score, DateTime)
        await withOracleDB(async (connection) => {
            const result = await connection.execute(`
                INSERT INTO ReviewContent (rID, cID, eID, Comments, Score, DateTime)
                VALUES (:rID, :cID, :eID, :Comments, :Score, :DateTime)
                `, [
                count['review'],
                customerID, edgeID,
                reviewContent.Comments,
                reviewContent.Score,
                reviewContent.DateTime
            ]);
            return result.rowsAffected && result.rowsAffected > 0;
        }).catch(() => {
            return false;
        });
        count['review']++;
        return true;
    }
}
class Company extends User {
    static async signUp(account, password, companyInfo) {
        let res = await super.signUp(account, password, True);
        if (res == false) return false;
        // insert the new company into the database.
        let res2 = await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `INSERT INTO Company (Name, Email, Phone, Address) 
                VALUES (:Name, :Email, :Phone, :Address)`,
                [companyInfo.Name, companyInfo.Email, companyInfo.Phone, companyInfo.Address],
                { autoCommit: true }
            );
            return result.rowsAffected && result.rowsAffected > 0;
        }).catch(() => {
            return false;
        });
        if (res2 == false) return false;
        userCount['company']++;
        return true;
    }
    static async getBookingStatus(id) {
        return await getBookingStatus();
    }
}
async function sendGiftCard(customer_id, card_value) {
    return await withOracleDB(async (connection) => {
        // const new_balacle = 50;
        const result = await connection.execute(
            `UPDATE UserAccount SET balance=9999 WHERE id=1`
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// AJ: might need to fix this. 
async function loginCustomer(account, password) {
    // AL:should use User.signIn() instead of this function.
    return utils.verifyLoginData(account, password);
}


async function searchRoute(startNodeID, endNodeID, difficultyMin = 0, difficultyMax = 3) {
    // get lifts, runs, and nodes from the database
    //check if startNodeID and endNodeID are part of the mountain
    let nodesMountain = getNodes([startNodeID, endNodeID], ['nID', 'mountainAddress']);
    if (nodesMountain.length != 2) {
        console.log('one of the nodes does not exist');
        return [];
    }
    if (nodesMountain[0][1] != nodesMountain[1][1]) {
        console.log('The nodes are not part of the same mountain');
        return [];
    }
    let mountain = nodesMountain[0][1];
    let lifts = await getLifts(mountain, difficultyMin, difficultyMax);
    let runs = await getRuns(mountain, difficultyMin, difficultyMax);
    let edges = [...lifts, ...runs];
    //get the nodeIDs of the edges
    let nodeIDs = new Set();
    for (let edge of edges) {
        nodeIDs.add(edge[1]);
        nodeIDs.add(edge[2]);
    }
    let nodes = await getNodes(Array.from(nodeIDs));
    let graph = routing.buildGraph(nodes, edges);
    let path = routing.aStarSearch(
        graph, startNodeID, endNodeID,
        costFunction = (e => e.length)
    );
    return path; //(ids of edges)
}

async function getRuns(mountain, difficultyMin = 0, difficultyMax = 3) {
    // search for all the edges, where the beginNodeId and endNodeID part of the mountain
    // Run(eID, Difficulty)
    // Edge(eid, beginNodeID, endNodeID, length, startTime, endTime)
    // Owns_Mountain(Address, Capacity, Name, companyName)
    // Has_Node(nID, elevation, xCoord, yCoord, mountainAddress)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT e.eID, e.beginNodeID, e.endNodeID, e.length, r.difficulty
            FROM Run r, Edge e, Owns_Mountain om, Has_Node hn0, Has_Node hn1
            WHERE
                om.Name = :mountain AND
                r.eID = e.eID AND
                hn0.nID = e.beginNodeID AND hn0.mountainAddress = om.Address AND
                hn1.nID = e.endNodeID   AND hn1.mountainAddress = om.Address AND
                r.difficulty >= :difficultyMin AND difficulty <= :difficultyMax
        `[mountain, difficultyMin, difficultyMax]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}
async function getRunsHigherAvgScore(minAvgScore) {
    // Aggregation with HAVING
    return await withOracleDB(async (connection) => {
        const sql_Query = `
            SELECT r.eID, AVG(rc.Score) AS avgScore
            FROM Run r, Review rw, ReviewContent rc 
            WHERE r.eID = rw.eID AND rw.cID = rc.cID AND rw.DateTime = rc.DateTime
            GROUP BY r.eID
            HAVING AVG(rc.Score) > :minAvgScore
        `;
        const result = await connection.execute(sql_Query, [minAvgScore]);

        return result.rows;
    }).catch((err) => {
        console.error("Error finding runs with higher average: ", err);
        return [];
    });
}
async function getLifts(mountain) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT e.eID, e.beginNodeID, e.endNodeID, e.length
            FROM Lift l, Edge e, Owns_Mountain om, Has_Node hn0, Has_Node hn1
            WHERE
                om.Name = :mountain AND
                l.eID = l.eID AND
                hn0.nID = e.beginNodeID AND hn0.mountainAddress = om.Address AND
                hn1.nID = e.endNodeID   AND hn1.mountainAddress = om.Address AND
        `[mountain, difficultyMin, difficultyMax]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getNodes(nodeIDs, columns = ['nID', 'xCoord', 'yCoord', 'elevation']) {
    // Has_Node(nID, elevation, xCoord, yCoord, mountainAddress)
    if (columns.length == 0) return [];
    // filter the columns to be only the ones that are in the table
    columns = Array.from(new Set(levels).intersection(
        new Set(['nID', 'xCoord', 'yCoord', 'elevation']))
    );
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT ${columns.join(',')}
            FROM Has_Node
            WHERE nID IN (:nodeIDs)
        `, [nodeIDs]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getAllNodes(columns = ['nID', 'xCoord', 'yCoord', 'elevation', 'mountainAddress']) {
    if (columns.length == 0) return [];
    // filter the columns to be only the ones that are in the table
    columns = Array.from(new Set(levels).intersection(
        new Set(['nID', 'xCoord', 'yCoord', 'elevation']))
    );
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT ${columns.join(',')}
            FROM Has_Node
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getAllRuns() {
    // Run(eID, Difficulty)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT * FROM Run
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getReviewsOfARun(eID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT rc.cID, rc.DateTime, rc.Score, rc.Comments FROM ReviewContent rc, Review r WHERE r.eID = :eID AND rc.rID = r.rID'
        );
        return result.rows;
    }).catch(() => {
        return [];
    })
}

async function chargeCustomer(customerID, price) {
    return true;
}
async function refundCustomer(customerID, price) {
    return true;
}

async function getAllInstructors() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Instructor');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// async function getAllLessons(company_name) {
// use User.getAllLessons() instead
//     return [];
// }

// async function getInstructorLessons(company_name, instructor_ID) {
// use User.getAllLessons(instructor=instructorID) instead
//     return [];
// }

// deletes instructor instance & all lessons associated with the given id
// async function deleteInstructor(instructor_ID) {
//     return true;
// }


async function getAllMountains(company_name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT m.Name, m.Capacity, m.Address FROM Owns_Mountain m WHERE m.companyName=:company_name`,
            { company_name: company_name }
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function addService(type, open_time, close_time) {
    return true;
}

async function deleteService(type) {
    return true;
}



async function getResortInfo(mountain_name) {
    return [];
}
async function findBestRun() {
    // find the best run among all runs in the database
    // Nested Aggregation with GroupBY
    // Has_Review_Left(rID,cID,EID,Comments,score, DateTime)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT rw.eID, AVG(rc.Score)
            FROM Review rw, ReviewContent rc, Run r
            WHERE rw.cID=rc.cID AND rw.DateTime=rc.DateTime            
            AND rw.eID = r.eID
            GROUP BY rw.eID
            HAVING AVG(rc.Score) >= ALL(
                SELECT AVG(rc2.Score)
                FROM Review rw2, ReviewContent rc2, Run r2
                WHERE rw2.eID = r2.eID AND rw2.DateTime=rc2.DateTime AND rw2.eID = r2.eID           
                GROUP BY r2.eID
            )
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getAllLevelInstructors(levels = [1, 2, 3]) {
    //  Division: find instructor teaching all 3 Difficulty level lessons
    // Instructor( iID, Name, Email, Phone )
    // Teaches_Lesson( lID, level, price, dateTime)
    // filter levels to be 1,2,3
    let level_set = new Set(levels).intersection(new Set([1, 2, 3]));
    if (level_set.size == 0) return [];
    let levels_string = Array.from(level_set).join(',');// no instructor teaches this level
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT I.iID, I.Name, I.Email, I.Phone
            FROM Instructor I
            WHERE NOT EXISTS (
                -- Find a level that the instructor does NOT teach
                SELECT DISTINCT T."LEVEL"
                FROM Teaches_Lesson T
                WHERE T."LEVEL" IN (${levels_string}) and NOT EXISTS (
                    -- Check if the current instructor teaches this level
                    SELECT *
                    FROM Teaches_Lesson T2
                    WHERE T2.iID = I.iID AND T2."LEVEL" = T."LEVEL"
                )
            )
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Mar 29, 2025 by Andrew J.
// add company backend features

// getting all customers so that: 1. send gift card later. 2. search for the ticket/lesson status. 
async function getAllCustomers() {
    return await withOracleDB(async (connection) => {
        // Customer(cID INTEGER, Name VARCHAR(20) NOT NULL, Age INTEGER, SkillLevel INTEGER NOT NULL, PRIMARY KEY (cID))
        const result = await connection.execute('SELECT * FROM CUSTOMER');
        // not sure about the  frontend design, so leave a possible alternative:
        // const result = await connection.execute('SELECT cID, Name FROM CUSTOMER');

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getCustomerTicketHistory(cID) {
    return await withOracleDB(async (connection) => {
        // Buy_Sell_Ticket(tID INTEGER, PurchaseDate DATETIME, cID INTEGER, companyName VARCHAR(20), PRIMARY KEY (tID), FOREIGN KEY (cID) REFERENCES Customer (cID), FOREIGN KEY (companyName) REFERENCES Company(Name))
        const result = await connection.execute('SELECT * FROM Buy_Sell_Ticket WHERE cID = :cID', [cID]);
        // same, not sure about frontend design
        // const result = await connection.execute('SELECT tID, PurchaseDate, companyName FROM Buy_Sell_Ticket WHERE cID = :cID', [cID]);

        return result.rows;
    }).catch(() => {
        return [];
    });
}

// even not sure, as we don't have a table for it.
async function getCustomerLessonHistory(cID) {
    return await withOracleDB(async (connection) => {
        // // Buy_Sell_Lesson(tID INTEGER, PurchaseDate DATETIME, cID INTEGER, companyName VARCHAR(20), PRIMARY KEY (tID), FOREIGN KEY (cID) REFERENCES Customer (cID), FOREIGN KEY (companyName) REFERENCES Company(Name))
        const result = await connection.execute('SELECT * FROM Buy_Sell_Lesson WHERE cID = :cID', [cID]);
        // same, not sure about frontend design
        // const result = await connection.execute('SELECT tID, PurchaseDate, companyName FROM Buy_Sell_Ticket WHERE cID = :cID', [cID]);

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function setTicketPrice(company_name, price) {
    // CREATE TABLE Company_Price( Price FLOAT, companyName VARCHAR(20), PRIMARY KEY (companyName), FOREIGN KEY (companyName) REFERENCES Company(Name))
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Company_Price SET Price=:price where companyName=:company_name`,
            [price, company_name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// company - instructors
// copied from insertInstructor()
// AJ: might need to find max ID here. 
async function addInstructor(instructor_id, instructor_name, instructor_phone, instructor_email) {
    // CREATE TABLE Instructor(iID INTEGER, Name VARCHAR(20) NOT NULL, Email VARCHAR(30), Phone VARCHAR(15) NOT NULL, PRIMARY KEY(iID))
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Instructor (iID, Name, Email, Phone) 
             VALUES (:iID, :Name, :Email, :Phone)`,
            [instructor_id, instructor_name, instructor_phone, instructor_email],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// copied from sql_update
async function updateInstructor(instructor_id, instructor_email, instructor_phone) {
    // update those that are declared in the info(mapping) (Email, Phone, iID)
    // return false if info is empty
    // if (Object.keys(info).length == 0) return false;
    if (instructor_id == null || instructor_email == null || instructor_phone == null) return false;

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            UPDATE Instructor SET Email=:Email, Phone=:Phone
            WHERE iID=:iID
        `,
            { Email: instructor_email, Phone: instructor_phone, iID: instructor_id },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteInstructor(instructor_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Instructor WHERE iID=:instructor_id`,
            [instructor_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// copied from insertTeachesLesson
// AJ: might need to find max ID here. 
async function addTeachesLesson() {
    // CREATE TABLE Teaches_Lesson(lID INTEGER, Level INTEGER, DateTime DATETIME, PRIMARY KEY (lID), FOREIGN KEY (Level) REFERENCES Level_Price(Level))
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Teaches_Lesson (lID, Level, Price, DateTime)    
             VALUES (:lID, :Level, :Price, :DateTime)`,
            [lesson.lID, lesson.Level, lesson.Price, lesson.DateTime],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateTeachesLesson(Lesson) {
    // (lID INTEGER, Level INTEGER, DateTime DATETIME, 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Instructor SET "LEVEL"=:Level, DateTime=:DateTime where lID=:lID`,
            { Level: Lesson.Level, DateTime: Lesson.DateTime, lID: Lesson.lID },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteTeachesLesson(lID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Teaches_Lesson WHERE lID=:lID`,
            [lID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function getYoungestStudentAges() {
    // find the youngest students in each lesson
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT bl.lID, MIN(c.age) 
            FROM BuysLesson bl, Customer c 
            WHERE c.cID = bl.cid 
            GROUP BY bl.lID
        `);
        // SELECT bl.lID, MIN(c.age) FROM BuysLesson bl, Customer c WHERE c.cID = bl.cid GROUP BY bl.lID

        return result.rows;
    }).catch(() => {
        return false;
    })
}

// company - mountains, villages, 
// copied from insertOwnsMountain
async function addOwnsMountain(company_name, mountain_address, mountain_name, mountain_capacity) {
    // CREATE TABLE Owns_Mountain(Address VARCHAR(20) PRIMARY KEY, Capacity INTEGER, Name VARCHAR(20) NOT NULL, companyName VARCHAR(20) NOT NULL, FOREIGN KEY (companyName) REFERENCES Company(name))
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Owns_Mountain (Address, Capacity, Name, companyName)    
             VALUES (:Address, :Capacity, :Name, :companyName)`,
            [mountain_address, mountain_capacity, mountain_name, company_name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateOwnsMountain(mountain) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Owns_Mountain SET Capacity=:Capacity, Name=:Name where Address=:Address`,
            { Capacity: mountain.Capacity, Name: mountain.Name, Address: mountain.Address },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteOwnsMountain(Address) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Owns_Mountain WHERE Address=:Address`,
            [Address],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// JC: unsure best way to access all villages for a mountain
async function getAllVillages() {

}
async function dummyfunction() { }

// from insertVillage()
// AJ: might need to find max ID here.
async function addVillage(village_name) {
    // CREATE TABLE Village(nID INTEGER PRIMARY KEY, Name VARCHAR(20) NOT NULL, FOREIGN KEY (nID) REFERENCES Has_Node(nID))
    return await withOracleDB(async (connection) => {
        await insertNode(village);
        const result = await connection.execute(
            `INSERT INTO Village (nID, Name) 
             VALUES (:nID, :Name)`,
            [village.nID, village.Name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateVillage(village) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Village SET Name=:Name where nID=:nID`,
            { Name: village.Name, nID: village.nID },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteVillage(nID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Village WHERE nID=:nID`,
            [nID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// AJ: a dummy method for testing frontend integration on resetting all tables.
async function resetAllData() {
    try {
        console.log('Starting to drop all tables...');
        await dropAllTables();
        console.log('All tables dropped.');

        console.log('Starting to populate all tables...');
        await populateAllTables();
        console.log('All tables populated.');

        return true;
    } catch (error) {
        console.error('Error resetting all data:', error.message);
        return false;
    }
}


module.exports = {
    initializeConnectionPool,
    closePoolAndExit,
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    withOracleDB,
    // getBookingStatus,
    sendGiftCard,
    loginCustomer,
    // getLessonsBought,
    // cancelLesson,
    getAllNodes,
    getAllRuns,
    getRunsHigherAvgScore,
    getReviewsOfARun,
    // buyTicket,
    chargeCustomer,
    refundCustomer,
    // registerCompany,
    getAllInstructors,
    getAllLevelInstructors,
    // getAllLessons,
    // getInstructorLessons,
    getAllMountains,
    addOwnsMountain,
    deleteOwnsMountain,
    updateOwnsMountain,
    getAllVillages,
    addVillage,
    updateVillage,
    deleteVillage,
    addService,
    // leaveRunReview,
    // getPurchaseHistory,
    getResortInfo,
    getAllCustomers,
    getCustomerTicketHistory,
    getCustomerLessonHistory,
    getYoungestStudentAges,
    deleteService,
    // getLessonsAvailable,
    // buyLesson,
    setTicketPrice,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    addTeachesLesson,
    searchRoute,
    findBestRun,
    searchRoute,
    User,
    Customer,
    Company,
    resetAllData,
    dummyfunction
};