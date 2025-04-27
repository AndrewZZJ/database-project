// Mar 18, 2025 by Andrew J.
// A file for all SQL insert queries

const oracledb = require('oracledb');
const { withOracleDB } = require('../lib/oracledb_utils')

/*
    Function: add a new run, which needs to add a new edge and then add a new run. 
    Input: connection, run 
    Output: result
    Use case: a company IT tries to add a new run. 

    Note2: the run is a javascript object, which looks like:
        const run = {
            eID: 101,
            beginNodeID: 201, 
            endNodeID: 202, 
            OpenTime: TIME, 
            length: 500,
            OpenTime: '08:00:00',
            difficulty: 'Intermediate'
        };
    Note3: might need some mechanism finding next eID for a new run added. 
    Note4: maybe I need to pass connection from appService, and how I can use the connection from it?
*/
async function insertRun(run) {
    return await withOracleDB(async (connection) => {
        await insertEdge(run);

        const result = await connection.execute(
            `INSERT INTO Run (eID, difficulty) 
             VALUES (:eID, :difficulty)`,
            [run.eID, run.difficulty],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/*
    Lift( eID: INTEGER, Capacity: INTEGER, Type: VARCHAR[20] )
*/
async function insertLift(lift) {
    return await withOracleDB(async (connection) => {
        await insertEdge(run);

        const result = await connection.execute(
            `INSERT INTO Run (eID, difficulty) 
             VALUES (:eID, :difficulty)`,
            [lift.eID, lift.Capacity, lift.Type],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

/*
    Function: add a new run, which needs to add a new edge and then add a new run. 
    refer to insertRun for more information.
*/
async function insertEdge(run) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Edge (eID, length, OpenTime, difficulty) 
             VALUES (:eID, :length, :OpenTime, :difficulty)`,
            [run.eID, run.beginNodeID, run.endNodeID, run.lengthe, run.OpenTime],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Company( Name: VARCHAR[20], Email: VARCHAR[30], Phone: VARCHAR[15], Address: VARCHAR[50] )
async function insertCompany(company) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Company (Name, Email, Phone, Address) 
             VALUES (:Name, :Email, :Phone, :Address)`,
            [company.Name, company.Email, company.Phone, company.Address],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//Instructor( iID: INTEGER, Name: VARCHAR[20], Email: VARCHAR[30], Phone: VARCHAR[15] )
async function insertInstructor(instructor) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Instructor (iID, Name, Email, Phone) 
             VALUES (:iID, :Name, :Email, :Phone)`,
            [instructor.iID, instructor.Name, instructor.Email, instructor.Phone],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Buy_Sell_Ticket( tID:INTEGER, PurchaseDate: DATETIME, Price: FLOAT, cID:INTEGER, companyName:VARCHAR[20] )
async function insertBuySellTicket(ticket) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Buy_Sell_Ticket (tID, PurchaseDate, Price, cID, companyName) 
             VALUES (:tID, :PurchaseDate, :Price, :cID, :companyName)`,
            [ticket.tID, ticket.PurchaseDate, ticket.Price, ticket.cID, ticket.companyName],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// DayPass( tID:INTEGER, ExpiryTime: DATETIME )
async function insertDayPass(daypass) { 
    return await withOracleDB(async (connection) => {
        await insertBuySellTicket(daypass)

        const result = await connection.execute(
            `INSERT INTO DayPass (tID, ExpiryTime) 
             VALUES (:tID, :ExpiryTime)`,
            [daypass.tID, daypass.ExpiryTime],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// SeasonPass( tID:INTEGER, ExpiryDate: DATE )
async function insertSeasonPass(seasonpass) {
    return await withOracleDB(async (connection) => {
        await insertBuySellTicket(seasonpass)

        const result = await connection.execute(
            `INSERT INTO SeasonPass (tID, ExpiryTime) 
             VALUES (:tID, :ExpiryTime)`,
            [seasonpass.tID, seasonpass.ExpiryTime],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Level_Price(Level INTEGER, Price FLOAT)
async function insertLevelPrice(level_price) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Level_Price (Level, Price) 
             VALUES (:Level, :Price)`,
            [level_price.Level, level_price.Price],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Teaches_Lesson( lID:INTEGER, Level: INTEGER, Price: FLOAT, DateTime: DATETIME )
async function insertTeachesLesson(lesson) { 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Teaches_Lesson (lID, iID, Level, Price, DateTime)    
             VALUES (:lID, iID, :Level, :Price, :DateTime)`,
            [lesson.lID, lesson.Level, lesson.Price, lesson.DateTime],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Owns Mountain( Address: VARCHAR[50], Capacity: INTEGER, Name: VARCHAR[20], companyName: VARCHAR[20] )
async function insertOwnsMountain(mountain) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Owns_Mountain (Address, Capacity, Name, companyName)    
             VALUES (:Address, :Capacity, :Name, :companyName)`,     
            [mountain.Address, mountain.Capacity, mountain.Name, mountain.companyName],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Customer( cID: INTEGER, Name: VARCHAR[20], Age: INTEGER, SkillLevel: INTEGER)
async function insertCustomer(customer) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Customer (cID, Name, Age, SkillLevel) 
             VALUES (:cID, :Name, :Age, :SkillLevel)`,
            [customer.cID, customer.Name, customer.Age, customer.SkillLevel],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Has_Node( nID: INTEGER, elevation: FLOAT, xCoord: FLOAT, yCoord: FLOAT, mountainAddress:VARCHAR[20] )
async function insertHasNode(node) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Has_Node (nID, elevation, xCoord, yCoord, mountainAddress) 
             VALUES (:nID, :elevation, :xCoord, :yCoord, :mountainAddress)`,    
            [node.nID, node.elevation, node.xCoord, node.yCoord, node.mountainAddress],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Village( nID: INTEGER, Name: VARCHAR[20] )
// here, I assume that when IT add a new village, it will also add a new node, instead of adding it to an existing one.
async function insertVillage(village) {
    
    return await withOracleDB(async (connection) => {
        await insertNode(village);
        const result = await connection.execute(
            `INSERT INTO Village (nID, Name) 
             VALUES (:nID, :Name)`,
            [village.nID, village.Name],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Service( nID: INTEGER, Type: VARCHAR[20], AvailableTime: TIME )
async function insertService(service) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Service (nID, Type, AvailableTime) 
             VALUES (:nID, :Type, :AvailableTime)`,
            [service.nID, service.Type, service.AvailableTime],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Has_Review_Left( rID: INTEGER, cID: INTEGER, eID: INTEGER, Comments: VARCHAR[300], Score: FLOAT, DateTime: DATETIME )
// forgot the definition of score. is it 5-star? why float?
async function insertHasReviewLeft(review) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Has_Review_Left (rID, cID, eID, Comments, Score, DateTime) 
             VALUES (:rID, :cID, :eID, :Comments, :Score, :DateTime)`,
            [review.rID, review.cID, review.eID, review.Comments, review.Score, review.DateTime], 
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertReviewContent(review){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ReviewContent (cID, DateTime, Score, Comments)
            VALUES (:cID, :DateTime, :Score, :Comments)`,
            [review.cID, review.DateTime, review.Score, review.Comments],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });

}
async function insertReview(review) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            INSERT INTO Review (rID, eID, cID, DateTime) 
            VALUES (:rID, :eID,:cID,:DateTime)`,
            [review.rID, review.eID, review.cID, review.DateTime],
            {autoCommit: true}
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


// Company_Price(companyName, Price)
async function insertCompanyPrice(company_price) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Company_Price (companyName, Price) 
             VALUES (:companyName, :Price)`,   
            [company_price.companyName, company_price.Price],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//  BuysLesson(cID INTEGER,lID INTEGER)
async function insertBuysLesson(transction) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO BuysLesson (cID, lID) 
             VALUES (:cID, :lID)`,
            [transction.cID, transction.lID],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// //  BuysTicket(cID INTEGER, tID:INTEGER)
// async function insertBuysTicket(transaction) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO Buys_Ticket (cID, tID)
//              VALUES (:cID, :tID)`,
//             [transaction.cID, transaction.tID], 
//             {autoCommit: true}
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

module.exports = {
    insertCompany,
    insertInstructor,
    // insertBuySellTicket,
    insertDayPass,
    insertSeasonPass,
    insertLevelPrice,
    insertTeachesLesson,
    insertOwnsMountain,
    insertCustomer,
    insertHasNode,
    insertVillage,
    insertService,
    insertHasReviewLeft,
    insertReviewContent,
    insertReview,
    insertRun,
    insertLift,
    // insertEdge
    insertCompanyPrice, 
    insertBuysLesson,
    // insertBuysTicket
};