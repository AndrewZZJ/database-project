const chai = require('chai');
// const sinon = require('sinon');
const oracledb = require('oracledb');
const appService = require('../appService');
const tablesInit = require('../lib/tables_init');
const dropAllTables = require('../lib/sql_delete').dropAllTables2;
const loadEnvFile = require('../utils/envUtil');
const envVariables = loadEnvFile('./.env');
const {populateTables} = require('../lib/tuplePopulation');

const { expect } = require('chai');
oracledb.autoCommit = true;
// chai.config.includeStack = true;

const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};
async function initializeConnectionPool() {
    try {
        try {
            const pool = oracledb.getPool();
            console.log('Connection pool already exists');
            return pool;
        } catch (e) {
            throw e;
        }

        oracledb.initOracleClient({ libDir: envVariables.ORACLE_CLIENT_DIR });
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
        return oracledb.getPool();
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        try {
            const pool = oracledb.getPool();
            await pool.close(10); // 10 seconds grace period for connections to finish
            console.log('Pool closed');
        } catch (e) {
            console.log('No pool to close');
        }
        
        if (process.env.NODE_ENV !== 'test') {
            process.exit(0);
        }
    } catch (err) {
        console.error(err.message);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
}


after(async() => {
    await closePoolAndExit();
});

describe('SignUp/SignIn', () => {
    beforeEach(async () => {
        // await initializeConnectionPool()
        await tablesInit.initiateUserAccount(); // Initialize the UserAccount table before each test
    });    

    describe('signUp()', () => {
        it('should successfully register a new user', async () => {
            try{
                const result = await appService.User.signUp('testuser', 'password123');
                expect(result).to.be.true;
            } catch (error) {
                console.error('Error populating tables:', error.message);
                throw error;
            }
        });
        it('Sign in should fail with wrong password', async () => {
            await appService.User.signUp('alan', 'password', false)
            expect(await appService.User.signIn('alan', 'wrongPassword')).to.be.false;
        });
        
        it('Register should fail if account already exists', async () => {
            appService.User.signUp('alan', 'password', false)
            expect(await appService.User.signUp('alan', 'password2')).to.be.false;
        });
        it('Both Customer and Company should be able to register', async () => {
            expect(await appService.User.signUp('customer1', 'password123', false)).to.be.true;
            expect(await appService.User.signUp('company2', 'password123', true)).to.be.true;
        });
    });
    describe('signIn()', () => {
        it('should successfully sign in with correct account/password', async () => {
            // Mock successful login
            expect(await appService.User.signUp('testuser2', 'password123', false)).to.be.true;            
            expect(await appService.User.signIn('testuser2', 'password123')).to.equal('customer');            
        });
        
        it('should fail with wrong password', async () => {
            // Mock no matching user
            expect(await appService.User.signUp('testuser3', 'password123', false)).to.be.true;            
            expect(await appService.User.signIn('testuser3', 'wrongpassword123')).to.be.false;            
        });
        it('Both Customer and Company should be able to sign in and be returned with the "role"', async () => {
            expect(await appService.User.signUp('customer1', 'password123', false)).to.be.true;
            expect(await appService.User.signIn('customer1', 'password123', false)).to.equal('customer');
            expect(await appService.User.signUp('company2', 'password123', true)).to.be.true;
            expect(await appService.User.signIn('company2', 'password123', true)).to.equal('company');
        });

    });
    
});

describe('Division Function', () => {
    before(async () => {
        try {
            await dropAllTables(); // Drop all tables before each test
            // await initializeConnectionPool()
            // await populateTables(['Company', 'Instructor', 'Level_Price', 'Teaches_Lesson']); // Populate the tables before each test
            await populateTables(['Company']); // Populate the tables before each test
            await populateTables(['Instructor']); // Populate the tables before each test
            await populateTables(['Level_Price']); // Populate the tables before each test
            await populateTables(['Teaches_Lesson']); // Populate the tables before each test
        } catch (error) {
            console.error('Error populating tables:', error.message);
            throw error;
        }
    });
    describe('getAllLevelInstructors()', () => {
        it ('should return instructors that teaches all levels if no level specified', async () => {
            try{
                const instructors = await appService.getAllLevelInstructors([1,2,3]);
                console.log(instructors);
                expect(instructors).to.be.an('array');
                expect(instructors.length).to.equal(1);

            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });
        
        it ('should return all instructors for a specific level', async () => {
            try{
                const instructors = await appService.getAllLevelInstructors([1]);
                console.log(instructors);
                expect(instructors).to.be.an('array');
                expect(instructors.length).to.equal(3);
            } catch (error) {
                console.error(error.message);
                throw error;
            }
        });


    });
});
describe('Customer functions', async () => {
    describe('Lessons Related', () => {
        describe('getAllLessons()', () => {
            before(async () => {
                try {
                    await dropAllTables(); // Drop all tables before each test
                    // await initializeConnectionPool()
                    // await populateTables(['Company', 'Instructor', 'Level_Price', 'Teaches_Lesson']); // Populate the tables before each test
                    await populateTables(['Company']); // Populate the tables before each test
                    await populateTables(['Instructor']); // Populate the tables before each test
                    await populateTables(['Level_Price']); // Populate the tables before each test
                    await populateTables(['Teaches_Lesson']); // Populate the tables before each test
                } catch (error) {
                    console.error('Error populating tables:', error.message);
                }
                 // Initialize the Lessons table before each test
            });
            after(async () => {
                await dropAllTables();
            });
            // it('Should return empty array if no lessons exist', async () => {
            //     try{
            //         expect(await appService.Customer.getAllLessons().length).to.equal(0)
            //     }catch (error) {
            //         throw error;
            //     }
            // });
            it('Should return all lessons', async () => {
                try{
                    let lessons = await appService.Customer.getAllLessons();

                    expect(lessons).to.be.an('array');
                    expect(lessons.length).to.be.equal(9);
                    // console.log(lessons);
                } catch (error) {
                    console.error('Error populating tables:', error.message);
                    throw error;
                }
            });
            it('Should return lessons for a specific instructor', async () => {
                try{
                    let lessons = await appService.Customer.getAllLessons(instructorID=1455);

                    expect(lessons).to.be.an('array');
                    expect(lessons.length).to.be.equal(1);
                    // console.log(lessons);
                } catch (error) {
                    console.error('Error populating tables:', error.message);
                    throw error;
                }
            });
            

        });

    });








});
