const oracledb = require('oracledb');
const { withOracleDB } = require('./oracledb_utils');
const {tableInitMap} = require('./tables_init')

async function populateAllTables(){
    let tables = Object.keys(tableInitMap);
    await populateTables(tables);
}

async function populateTables(tables) {
    return withOracleDB(async (connection) => {
        for (const table of tables) {
            
            const initFunction = tableInitMap[table];
            if (initFunction) {
                try {
                    const isInitialized = await initFunction();
                    if (!isInitialized) {
                        console.error(`Failed to initialize ${table} table`);
                        continue;
                    }
                } catch (error) {
                    console.error(`Error initializing ${table} table: ${error.message}`);
                }
            } else {
                console.warn(`No initialization function found for ${table} table`);
                return
            };
        }
        for (const table of tables) {
            const query = insertQueries[table];
            if (query) {
                try {
                    await connection.execute(query);
                    await connection.commit(); // Commit the transaction
                    console.log(`Inserted data into ${table} table`);
                } catch (error) {
                    console.error(`Error inserting data into ${table} table: ${error.message}`);
                    throw error; // Rethrow the error to stop execution 
                }
            } else {
                console.warn(`No query found for ${table} table`);
            }
        }
    }).catch((error) => {
        console.error(`Error populating tables ${tables}:`, error.message);
    });
};


const insertQueries = {
    "Company": `INSERT ALL
        INTO Company (Name, Email, phone, address) VALUES ('Vail Resorts', 'comments@vailresorts.com', 9707540005, '390 Interlocken Crescent, Broomfield, Colarado')
        INTO Company (Name, Email, phone, address) VALUES ('Ski Louise', 'info@skilouise.com', 14035223555, '1 Whitehorn Road, Lake Louise, Alberta, Canada')
        INTO Company (Name, Email, phone, address) VALUES ('Banff Sunshine Village Ski & Snowboard Resort', 'reservations@skibanff.com', 18775422633, 'None')
        INTO Company (Name, Email, phone, address) VALUES ('Winsport', 'info@winsport.ca', 4032475452, '88 Canada Olympic Road SW, Calgary, AB')
        INTO Company (Name, Email, phone, address) VALUES ('Aspen Snowmass', 'contactus@aspensnowmass.com', 9709231227, 'Snowmass Village, CO, United States')
    SELECT 1 FROM dual`,

    "Company_Price": `INSERT ALL
        INTO Company_Price VALUES (302.00, 'Vail Resorts')
        INTO Company_Price VALUES (149.99, 'Ski Louise')
        INTO Company_Price VALUES (174.99, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Company_Price VALUES (86.00, 'Winsport')
        INTO Company_Price VALUES (254.99, 'Aspen Snowmass')
    SELECT 1 FROM dual`,

    "Instructor": `INSERT ALL
        INTO Instructor VALUES (1455, 'Shri Rana', 'srana@vailresorts.com', 3057483920)
        INTO Instructor VALUES (8987, 'Monica Baldric', 'mbaldric@skibanff.com', 2948553957)
        INTO Instructor VALUES (6178, 'Levi Ferguson', 'lferguson@aspensnowmass.com', 1037594836)
        INTO Instructor VALUES (4233, 'Rochelle Ramos', 'rramos@skilouise.com', 2039576849)
        INTO Instructor VALUES (3764, 'Isaiah Stout', 'istout@winsport.ca', 395493095)
    SELECT 1 FROM dual`,

    "Level_Price": `INSERT ALL
        INTO Level_Price VALUES (1, 44.99)
        INTO Level_Price VALUES (2, 59.99)
        INTO Level_Price VALUES (3, 69.99)
    SELECT 1 FROM dual`,

    "Teaches_Lesson": `INSERT ALL
        INTO Teaches_Lesson VALUES (496, 1455, 2, TO_DATE('2025-04-11 09:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (298, 8987, 1, TO_DATE('2025-12-03 11:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (209, 6178, 3, TO_DATE('2025-11-28 08:30:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (450, 4233, 1, TO_DATE('2024-11-10 01:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (451, 4233, 1, TO_DATE('2024-12-10 01:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (461, 4233, 2, TO_DATE('2024-12-11 01:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (386, 3764, 1, TO_DATE('2025-03-19 10:30:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (123, 3764, 2, TO_DATE('2025-03-20 10:30:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Teaches_Lesson VALUES (156, 3764, 3, TO_DATE('2025-03-21 10:30:00', 'YYYY-MM-DD HH24:MI:SS'))
    SELECT 1 FROM dual`,

    "Customer": `INSERT ALL
        INTO Customer VALUES (17171, 'Jenna Crowell', 23, 3)
        INTO Customer VALUES (29874, 'Alan Song-Hong Lee', 5, 1)
        INTO Customer VALUES (85763, 'Andrew Jiang', 82, 2)
        INTO Customer VALUES (74953, 'John Doe', 42, 3)
        INTO Customer VALUES (34563, 'Jane Doe', 45, 2)
        INTO Customer VALUES (29875, 'Victor Lee', 20, 1)
        INTO Customer VALUES (29876, 'Joe Lee', 18, 1)
        INTO Customer VALUES (23230, 'Lebron James', 40, 3)
    SELECT 1 FROM dual`,    

    "Buy_Sell_Ticket": `INSERT ALL
        INTO Buy_Sell_Ticket VALUES (8395341,                              NULL                      , NULL, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (8395342,                              NULL                      , NULL, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (8395343,                              NULL                      , NULL, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (8395344,                              NULL                      , NULL, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (8395345, TO_DATE('2025-03-19 04:42:13', 'YYYY-MM-DD HH24:MI:SS'), 17171, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (2149641, TO_DATE('2024-09-02 18:54:23', 'YYYY-MM-DD HH24:MI:SS'), 17171, 'Winsport')
        INTO Buy_Sell_Ticket VALUES (9745296, TO_DATE('2025-12-16 08:34:26', 'YYYY-MM-DD HH24:MI:SS'), 29874, 'Winsport')
        INTO Buy_Sell_Ticket VALUES (2508252, TO_DATE('2026-01-20 09:34:56', 'YYYY-MM-DD HH24:MI:SS'), 85763, 'Vail Resorts')
        INTO Buy_Sell_Ticket VALUES (1561451, TO_DATE('2025-03-25 13:36:55', 'YYYY-MM-DD HH24:MI:SS'), 74953, 'Aspen Snowmass')
        INTO Buy_Sell_Ticket VALUES (3520745, TO_DATE('2025-03-26 05:40:22', 'YYYY-MM-DD HH24:MI:SS'), 34563, 'Aspen Snowmass')
        INTO Buy_Sell_Ticket VALUES (8763531, TO_DATE('2023-08-24 13:45:34', 'YYYY-MM-DD HH24:MI:SS'), 17171, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (3040124, TO_DATE('2023-07-28 15:35:12', 'YYYY-MM-DD HH24:MI:SS'), 74953, 'Vail Resorts')
        INTO Buy_Sell_Ticket VALUES (9384759, TO_DATE('2024-09-29 18:05:30', 'YYYY-MM-DD HH24:MI:SS'), 85763, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Buy_Sell_Ticket VALUES (2983742, TO_DATE('2022-09-14 15:02:23', 'YYYY-MM-DD HH24:MI:SS'), 74953, 'Aspen Snowmass')
        INTO Buy_Sell_Ticket VALUES (2983743,                              NULL                      ,  NULL, 'Aspen Snowmass')
        INTO Buy_Sell_Ticket VALUES (2983744,                              NULL                      ,  NULL, 'Aspen Snowmass')
        INTO Buy_Sell_Ticket VALUES (2983745,                              NULL                      ,  NULL, 'Aspen Snowmass')
        INTO Buy_Sell_Ticket VALUES (2983746,                              NULL                      ,  NULL, 'Aspen Snowmass')
    SELECT 1 FROM dual`,

    "DayPass": `INSERT ALL
        INTO DayPass VALUES (8395341, NULL)
        INTO DayPass VALUES (8395342, NULL)
        INTO DayPass VALUES (8395343, NULL)
        INTO DayPass VALUES (8395344, NULL)
        INTO DayPass VALUES (8395345, TO_DATE('2025-03-20 16:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO DayPass VALUES (9745296, TO_DATE('2025-12-16 19:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO DayPass VALUES (2508252, TO_DATE('2026-01-20 16:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO DayPass VALUES (1561451, TO_DATE('2025-03-26 16:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        INTO DayPass VALUES (3520745, TO_DATE('2025-03-26 16:00:00', 'YYYY-MM-DD HH24:MI:SS'))
    SELECT 1 FROM dual`,

    "SeasonPass": `INSERT ALL
        INTO SeasonPass VALUES (2149641, TO_DATE('2025-04-02', 'YYYY-MM-DD'))
        INTO SeasonPass VALUES (8763531, TO_DATE('2024-05-14', 'YYYY-MM-DD'))
        INTO SeasonPass VALUES (3040124, TO_DATE('2024-05-20', 'YYYY-MM-DD'))
        INTO SeasonPass VALUES (9384759, TO_DATE('2025-05-24', 'YYYY-MM-DD'))
        INTO SeasonPass VALUES (2983742, TO_DATE('2023-05-18', 'YYYY-MM-DD'))
        INTO SeasonPass VALUES (2983743, NULL)
        INTO SeasonPass VALUES (2983744, NULL)
        INTO SeasonPass VALUES (2983745, NULL)
        INTO SeasonPass VALUES (2983746, NULL)
    SELECT 1 FROM dual`,

    "Owns_Mountain": `INSERT ALL
        INTO Owns_Mountain VALUES ('241 E Meadow Dr, Vail, CO', 66558, 'Vail', 'Vail Resorts')
        INTO Owns_Mountain VALUES ('4545 Blackcomb Way, Whistler, BC', 69939, 'Whistler Blackcomb', 'Vail Resorts')
        INTO Owns_Mountain VALUES ('1 Whitehorn Road, Lake Louise, AB', 14000, 'The Lake Louise Ski Resort', 'Ski Louise')
        INTO Owns_Mountain VALUES ('None', 20000, 'Banff Sunshine Village Ski & Snowboard Resort', 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Owns_Mountain VALUES ('88 Canada Olympic Road SW, Calgary, AB', 12000, 'Winsport', 'Winsport')
        INTO Owns_Mountain VALUES ('601 E Dean St, Aspen, CO', 13400, 'Aspen Mountain Ski Resort', 'Aspen Snowmass')
        INTO Owns_Mountain VALUES ('Snowmass Village, CO', 32000, 'Snowmass Mountain', 'Aspen Snowmass')
    SELECT 1 FROM dual`,
    "Has_Node": `INSERT ALL
        INTO Has_Node VALUES (983479,  670,    0,      0, '4545 Blackcomb Way, Whistler, BC')
        INTO Has_Node VALUES (983345, 1045,  0.1,    0.2, '4545 Blackcomb Way, Whistler, BC')
        INTO Has_Node VALUES (847592,  685,  0.4,    0.5, '4545 Blackcomb Way, Whistler, BC')
        INTO Has_Node VALUES (847304,  723,   .2,     .6, '4545 Blackcomb Way, Whistler, BC')
        INTO Has_Node VALUES (374590, 2480, 19.0,  723.1, '241 E Meadow Dr, Vail, CO')
        INTO Has_Node VALUES (374293, 2984, 19.1,  723.0, '241 E Meadow Dr, Vail, CO')
        INTO Has_Node VALUES (384752, 2475, 19.2,  723.3, '241 E Meadow Dr, Vail, CO')
        INTO Has_Node VALUES (384934, 3013, 19.3,  723.2, '241 E Meadow Dr, Vail, CO')
        INTO Has_Node VALUES (293842, 2500,  7.1, 135.11, 'Snowmass Village, CO')
        INTO Has_Node VALUES (293304, 2624,  7,   135.00, 'Snowmass Village, CO')
    SELECT 1 FROM dual`,

    "Village": `INSERT ALL
        INTO Village VALUES (983479, 'Whistler Village')
        INTO Village VALUES (847592, 'Upper Village')
        INTO Village VALUES (374590, 'Vail Village')
        INTO Village VALUES (384752, 'Lionshead Village')
        INTO Village VALUES (293842, 'Snowmass Village')
    SELECT 1 FROM dual`,

    "Service": `INSERT ALL
        INTO Service VALUES (983479, 'Food',    TO_DATE('09:00:00','HH24:MI:SS'), TO_DATE('16:00:00','HH24:MI:SS'))
        INTO Service VALUES (983479, 'Lodging', TO_DATE('06:00:00','HH24:MI:SS'), TO_DATE('21:00:00','HH24:MI:SS'))
        INTO Service VALUES (847592, 'Bar',     TO_DATE('15:00:00','HH24:MI:SS'), TO_DATE('22:00:00','HH24:MI:SS'))
        INTO Service VALUES (847592, 'Food',    TO_DATE('10:00:00','HH24:MI:SS'), TO_DATE('18:00:00','HH24:MI:SS'))
        INTO Service VALUES (374590, 'Lodging', TO_DATE('07:00:00','HH24:MI:SS'), TO_DATE('22:00:00','HH24:MI:SS'))
        INTO Service VALUES (374590, 'Food',    TO_DATE('09:30:00','HH24:MI:SS'), TO_DATE('17:30:00','HH24:MI:SS'))
    SELECT 1 FROM dual`,

    "Edge": `INSERT ALL
        INTO Edge VALUES (82734, 983479, 983345, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('16:00:00', 'HH24:MI:SS'), 430)
        INTO Edge VALUES (28342, 847592, 847304, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('16:00:00', 'HH24:MI:SS'), 45)
        INTO Edge VALUES (37684, 374590, 374293, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('15:00:00', 'HH24:MI:SS'), 560)
        INTO Edge VALUES (59382, 384752, 384934, TO_DATE('08:30:00', 'HH24:MI:SS'), TO_DATE('16:00:00', 'HH24:MI:SS'), 730)
        INTO Edge VALUES (30844, 293842, 293304, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('16:30:00', 'HH24:MI:SS'), 140)
        INTO Edge VALUES (27342, 983345, 983479, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('16:30:00', 'HH24:MI:SS'), 436)
        INTO Edge VALUES (92384, 847304, 847592, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('16:30:00', 'HH24:MI:SS'), 50)
        INTO Edge VALUES (27384, 374293, 374590, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('15:30:00', 'HH24:MI:SS'), 570)
        INTO Edge VALUES (85843, 384934, 384752, TO_DATE('08:30:00', 'HH24:MI:SS'), TO_DATE('16:30:00', 'HH24:MI:SS'), 760)
        INTO Edge VALUES (82347, 293304, 293842, TO_DATE('08:00:00', 'HH24:MI:SS'), TO_DATE('17:00:00', 'HH24:MI:SS'), 154)
    SELECT 1 FROM dual`,

    "Run": `INSERT ALL
        INTO Run VALUES (27342, 2)
        INTO Run VALUES (92384, 1)
        INTO Run VALUES (27384, 3)
        INTO Run VALUES (85843, 3)
        INTO Run VALUES (82347, 1)
    SELECT 1 FROM dual`,

    "LiftCapacity": `INSERT ALL
        INTO LiftCapacity VALUES ('T-Bar', 1)
        INTO LiftCapacity VALUES ('Gondola', 8)
        INTO LiftCapacity VALUES ('Small Chairlift', 2)
        INTO LiftCapacity VALUES ('Medium Chairlift', 4)
        INTO LiftCapacity VALUES ('Large Chairlift', 6)
        INTO LiftCapacity VALUES ('Poma Lift', 1)
        INTO LiftCapacity VALUES ('Magic Carpet', 1)
    SELECT 1 FROM dual`,

    "LiftType": `INSERT ALL
        INTO LiftType VALUES (82734, 'Medium Chairlift')
        INTO LiftType VALUES (28342, 'Magic Carpet')
        INTO LiftType VALUES (37684, 'Gondola')
        INTO LiftType VALUES (59382, 'Large Chairlift')
        INTO LiftType VALUES (30844, 'T-Bar')
    SELECT 1 FROM dual`,

    "ReviewContent": `INSERT ALL
        INTO ReviewContent VALUES (17171, TO_DATE('2023-05-25 20:45:29', 'YYYY-MM-DD HH24:MI:SS'), 4, 'Good')
        INTO ReviewContent VALUES (74953, TO_DATE('2023-04-08 12:45:24', 'YYYY-MM-DD HH24:MI:SS'), 1, 'Bad :(')
        INTO ReviewContent VALUES (85763, TO_DATE('2024-11-05 19:10:35', 'YYYY-MM-DD HH24:MI:SS'), 2, 'Not Great')
        INTO ReviewContent VALUES (34563, TO_DATE('2023-07-22 14:28:01', 'YYYY-MM-DD HH24:MI:SS'), 3, 'Meh')
        INTO ReviewContent VALUES (85763, TO_DATE('2023-01-07 02:10:29', 'YYYY-MM-DD HH24:MI:SS'), 5, 'Amazing!')
    SELECT 1 FROM dual`,

    "Review": `INSERT ALL
        INTO Review VALUES (452, 85843, 17171, TO_DATE('2023-05-25 20:45:29', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Review VALUES (743, 27384, 74953, TO_DATE('2023-04-08 12:45:24', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Review VALUES (923, 82347, 85763, TO_DATE('2024-11-05 19:10:35', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Review VALUES (839, 92384, 34563, TO_DATE('2023-07-22 14:28:01', 'YYYY-MM-DD HH24:MI:SS'))
        INTO Review VALUES (659, 27342, 85763, TO_DATE('2023-01-07 02:10:29', 'YYYY-MM-DD HH24:MI:SS'))
    SELECT 1 FROM dual`,

    "Hires": `INSERT ALL
        INTO Hires VALUES (1455, 'Vail Resorts')
        INTO Hires VALUES (8987, 'Banff Sunshine Village Ski & Snowboard Resort')
        INTO Hires VALUES (6178, 'Aspen Snowmass')
        INTO Hires VALUES (4233, 'Ski Louise')
        INTO Hires VALUES (3764, 'Winsport')
    SELECT 1 FROM dual`,

    "BuysLesson": `INSERT ALL
        INTO BuysLesson VALUES (85763, 496)
        INTO BuysLesson VALUES (29874, 298)
        INTO BuysLesson VALUES (17171, 209)
        INTO BuysLesson VALUES (29874, 450)
        INTO BuysLesson VALUES (29876, 450)
        INTO BuysLesson VALUES (34563, 386)
        INTO BuysLesson VALUES (29875, 386)
        INTO BuysLesson VALUES (23230, 386)
    SELECT 1 FROM dual`,

    "UserAccount": `INSERT ALL
        INTO UserAccount VALUES ('VailResorts', 'password', 'company', 0)
        INTO UserAccount VALUES ('SkiLouise', 'password', 'company', 0)
        INTO UserAccount VALUES ('BanffSunshine', 'password', 'company',0)
        INTO UserAccount VALUES ('Winsport', 'password', 'company',0)
        INTO UserAccount VALUES ('Aspen Snowmass', 'password', 'company',0)
        INTO UserAccount VALUES ('Alan', 'password', 'customer',  100)
        INTO UserAccount VALUES ('Jenna', 'password', 'customer', 100)
        INTO UserAccount VALUES ('Andrew', 'password', 'customer', 100)
    SELECT 1 FROM dual`,

    // this table should be removed
    // "BuysTicket": `INTO BuysTicket VALUES 
    //     (17171, 8395345)
    //     (17171, 2149641)
    //     (29874, 9745296)
    //     (85763, 2508252)
    //     (74953, 1561451)
    //     (34563, 3520745)
    //     (17171, 8763531)
    //     (74953, 3040124)
    //     (85763, 9384759)
    //     (74953, 2983742)`
};


module.exports = {
    populateTables,
    populateAllTables
};