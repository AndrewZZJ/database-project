import {initializeConnectionPool, closePoolAndExit, withOracleDB} from './appService.js';
import {populateAllTables} from './lib/tuplePopulation.js';
import {dropAllTables2} from './lib/sql_delete.js';
// import fs from 'fs/promises';
// import path from 'path';

async function main() {
    await initializeConnectionPool()
    await dropAllTables2()
    await populateAllTables()// creates all tables and populates them with data
    await closePoolAndExit()
}


// async function executeSQLFile(filePath) {
    
//     const sql = await fs.readFile(filePath, 'utf8');
//     return await withOracleDB(async (connection) => {
//         const statements = sql.split(/;\s*$/m);
//         for (const statement of statements) {
//             const trimmedStatement = statement.trim();
//             if (trimmedStatement) { // Ignore empty statements
//                 // skip SET DEFINE OFF; SET SERVEROUTPUT ON;
//                 if (statement.includes('SET DEFINE OFF') || statement.includes('SET SERVEROUTPUT ON')) {
//                     continue;
//                 }
//                 console.log(`Executing: ${trimmedStatement}`);
                
//                 if (trimmedStatement.endsWith('/')) {
//                     // if the statement ends with '/', remove it and execute the statement
//                     await connection.execute(trimmedStatement.slice(0, -1));
//                 } else {
//                     await connection.execute(trimmedStatement);
//                 }
//             }
//         }
//     });
// }
// async function resetAllTables() {
//     await initializeConnectionPool();

//     const sqlFilePath = path.resolve('./sql/populateAllTables.sql');
//     await executeSQLFile(sqlFilePath);

//     await closePoolAndExit();
// }



await main()