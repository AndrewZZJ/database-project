const { withOracleDB } = require('../lib/oracledb_utils')

// async function updateNameDemotable(oldName, newName) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//             [newName, oldName],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }


/*
    function: update customer's information.
    input: customer object with all attributes.  
*/
async function updateCustomer(customer) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Customer SET Name=:Name, SkillLevel=:SkillLevel, Age=:Age where cID=:cID`,
            {Name: customer.Name, SkillLevel: customer.SkillLevel, Age: customer.Age, cID:customer.cID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateCompany(Company) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Company SET Email=:Email, Phone=:Phone, Address=:Address where Name=:Name`,
            {Email: Company.Email, Phone: Company.Phone, Address: Company.Address, Name:Company.Name},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateInstructor(Instructor) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Instructor SET Email=:Email, Phone=:Phone where iID=:iID`,
            {Email: Instructor.Email, Phone: Instructor.Phone, iID:Instructor.iID},
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
            {Capacity: mountain.Capacity, Name: mountain.Name, Address: mountain.Address},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}   

async function updateLift(lift) {
    return await withOracleDB(async (connection) => {
        await updateEdge(lift);
        const result = await connection.execute(
            `UPDATE Lift SET Capacity=:Capacity, Type=:Type where eID=:eID`,
            {Capacity: lift.Capacity, Type: lift.Type, eID:lift.eID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateRun(run) {
    return await withOracleDB(async (connection) => {
        await updateEdge(run);
        const result = await connection.execute(
            `UPDATE Run SET Difficulty=:difficulty where eID=:eID`,
            {Difficulty: run.difficulty, eID:run.eID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateEdge(edge) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Edge SET length=:length, OpenTime=:OpenTime where eID=:eID`,
            {length: edge.length, OpenTime: edge.OpenTime, eID:edge.eID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateReview(review) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Review SET DateTime=:DateTime, Score=:score , Comments=:comments where rID=:rID`,
            {DateTime: review.DateTime, score: review.score, comments: review.comments, rID:review.rID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    updateCustomer,
    updateCompany,
    updateInstructor,
    updateOwnsMountain,
    updateLift,
    updateRun,
    updateReview,

}