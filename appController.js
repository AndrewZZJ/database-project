const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

/*
    Mar 20, 2025 by Andrew J.
    ----- Begin of Andrew's work. -----
*/
// ----- Company -----

// view customer booking status, and the following is a sazmple to the query endpoint
// note: the address looks like `/booking_status?customer_id=1`, but not sure if it works.
router.get('/booking-status', async (req, res) => {
    const customer_id = req.query.customer_id;
    const result = await appService.Customer.getBookingStatus(customer_id);
    res.json(result);
});

// send gift card
// note1: refer to the sample ndpoint update-name-demotable
router.post("/send-gift-card", async (req, res) => {
    // const customer_id = req.query.customer_id;
    // const { user_id, value } = req.body;
    // const updateResult = await appService.sendGiftCard(user_id, value);
    // AJ: test sendGiftCard()
    const updateResult = await appService.sendGiftCard(1, 50);
    if (updateResult) {
        // res.json({ success: true });
        res.json({ success: "ASD" });
    } else {
        res.status(500).json({ success: false });
    }
});

// ----- Customer (&Guests) -----

// customer registration
// note: not sure is `req` is a json/JS object that I can use directly in registerCustomer()
router.post("/register-customer", async (req, res) => {
    // const insertResult = await appService.registerCustomer(req);
    const { account, password, customerInfo } = req.body;
    const insertResult = await appService.Customer.signUp(req);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// customer login
router.get('/customer-login', async (req, res) => {
    const { account, password } = req.body;
    const loginResult = await appService.Customer.signIn(account, password);

    res.json({
        success: loginResult
    });

});

router.get('/show-all-tickets', async (req, res) => {
    // show all tickets 
    // (tID, Price, companyName, type)
    // type is 'Day' or 'Season'
    const tableContent = await appService.User.getAllTickets();
    res.json({ data: tableContent });
});
router.get('/show-tickets-selling', async (req, res) => {
    // show all tickets selling
    // (tID, Price, companyName, type)
    // type is 'Day' or 'Season'
    const tableContent = await appService.User.getTicketsSelling();
    res.json({ data: tableContent });
});

// buy a ticket
router.post("/buy-a-ticket", async (req, res) => {
    const { cID, isDayPass } = req.body;
    // AJ: ticket price not finalized. need to go back to this. 
    const ticekt_price = isDayPass == true ? 20 : 60;
    const buyResult = await appService.insertDemotable(cID, isDayPass);
    const chargeResult = await appService.chargeCustomer(cID, ticekt_price);
    if (buyResult && chargeResult) {
        res.json({ success: true });
    } else {
        // AJ: might need a better mechanism checking which error happened here. Get back here if we have time. 
        res.status(500).json({ success: false });
    }
});

// show all lessons & cancel a lesson
// show all lessons
router.get('/lessons-purchased', async (req, res) => {
    const { customer_id } = req.body;
    const tableContent = await appService.Customer.getLessonsBought(customer_id);
    res.json({ data: tableContent });
});

// cancel a lesson
router.delete("/cancel-a-lesson", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.Customer.cancelLesson(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// show all nodes & search ski routes
// show all nodes 
router.get('/all-nodes', async (req, res) => {
    const tableContent = await appService.getAllNodes();
    res.json({ data: tableContent });
});

// search ski routes
// searchRoute(startNodeID, endNodeID, difficultyMin=0, difficultyMax=3)
// AJ: a quick fix.
router.post("/get-ski-routes", async (req, res) => {
    const { startNodeID, endNodeID } = req.body;
    const tableContent = await appService.searchRoute(startNodeID, endNodeID, 0, 3);
    res.json({ data: tableContent });
});

// show all runs & check reviews of a run
router.get('/best-run', async (req, res) => {
    const tableContent = await appService.findBestRun();
    res.json({ data: tableContent });
});

// show all runs 
router.get('/all-runs', async (req, res) => {
    const tableContent = await appService.getAllRuns();
    res.json({ data: tableContent });
});

router.get('/all-runs-higher-avg-score', async (req, res) => {
    const {minValue} = req.body;
    const tableContent = await appService.getRunsHigherAvgScore(minValue);
    res.json({ data: tableContent });
});

// check reviews of a run
router.get('/all-reviews-of-a-run', async (req, res) => {
    const { eID } = req.body;
    const tableContent = await appService.getReviewsOfARun(eID);
    res.json({ data: tableContent });
});

router.get('/get-identity', async (req, res) => {
    res.send(`${req.app.locals.userIdentity}`);
})

// AJ: using JSON as input in the req.body 
router.post('/set-identity', async (req, res) => {

    const { new_identity } = req.body;

    if (!new_identity) {
        return res.status(400).send("Missing new_identity");
    }

    req.app.locals.userIdentity = new_identity;
    res.send(`${req.app.locals.userIdentity}`);
})

/*
    ----- End of Andrew's work. -----
*/

/*
 Mar 27, 2025 by Jenna C.
    ----- Begin Jenna's work. -----
*/

// -------- Company --------

// company registration
router.post("/register-company", async (req, res) => {
    // companyInfo = {Name, Email, Phone, Address}
    const { account, password, companyInfo } = req.body;
    const insertResult = await appService.Company.signUp(req);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// company login
router.get('/company-login', async (req, res) => {
    const { account, password } = req.body;
    const loginResult = await appService.Company.signIn(account, password);

    res.json({
        success: loginResult
    })
});

// ----- SERVICE MANAGEMENT ----

// ----- manage lessons & instructors -----
// show all instructors
router.get('/show-instructors', async (req, res) => {
    const tableContent = await appService.getAllInstructors();
    res.json({ data: tableContent });
});

// show all lessons
router.get('/show-lessons', async (req, res) => {
    // can filter by instructor_ID
    // const { instructor_ID } = req.body;
    const tableContent = await appService.User.getAllLessons();
    res.json({ data: tableContent });
});

// show lessons of instructor
router.get('/show-instructor-lessons', async (req, res) => {
    const { instructor_ID } = req.body;
    const tableContent = await appService.User.getAllLessons(instructor_ID);
    res.json({ data: tableContent });
});

router.get('/get-all-level-instructors', async (req, res) => {
    // const levels = req.query.levels.split(',').map(Number);
    // const tableContent = await appService.getAllLevelInstructors(levels);
    const tableContent = await appService.getAllLevelInstructors();
    res.json({ data: tableContent });
});

router.post('/add-instructor', async (req, res) => {
    const { instructor_id, instructor_name, instructor_phone, instructor_email } = req.body;
    const insertResult = await appService.addInstructor(instructor_id, instructor_name, instructor_phone, instructor_email);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/update-instructor', async (req, res) => {
    const { instructor_id, instructor_email, instructor_phone } = req.body;
    const updateResult = await appService.updateInstructor(instructor_id, instructor_email, instructor_phone);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

// delete lesson same as above?

// delete instructor and all associated lessons
router.delete('/delete-instructor', async (req, res) => {
    const { instructor_id } = req.body;
    const deleteResult = await appService.deleteInstructor(instructor_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/get-youngest-student-ages', async (req, res) => {
    const tableContent = await appService.getYoungestStudentAges();
    res.json({ data: tableContent });
})

// ----- manage tickets -----
// set ticket price
router.post('/set-ticket-price', async (req, res) => {
    const { company_name } = req.body;
    const updateResult = await appService.setPrice(company_name);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.put('/show-mountains', async (req, res) => {
    const { company_name } = req.body;
    const tableContent = await appService.getAllMountains(company_name);
    res.json({ data: tableContent });
})

router.post('/add-mountain', async (req, res) => {
    const { company_name, mountain_address, mountain_name, mountain_capacity } = req.body;
    const insertResult = await appService.addOwnsMountain(company_name, mountain_address, mountain_name, mountain_capacity);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/delete-mountain', async (req, res) => {
    const { mountain_address } = req.body;
    const deleteResult = await appService.deleteOwnsMountain(mountain_address);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/update-mountain_info', async (req, res) => {
    const { mountain_address, capacity, mountain_name } = req.body;
    const updateResult = await appService.updateMountainInfo(mountain_address, capacity, mountain_name);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/add-village', async (req, res) => {
    const { village_name } = req.body;
    const insertResult = await appService.addVillage(village_name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/delete-village', async (req, res) => {
    const { village_name } = req.body;
    const deleteResult = await appService.deleteVillage(village_name);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/add-service', async (req, res) => {
    const { type, open_time, close_time } = req.body;
    const insertResult = await appService.addService(type, open_time, close_time);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/delete-service', async (req, res) => {
    const { service_type } = req.body;
    const deleteResult = await appService.deleteService(service_type);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/lesson-status', async (req, res) => {
    const { customer_id } = req.body;
    const tableContent = await appService.getLessonsBought(customer_id)
    res.json({ data: tableContent });
})

// show all lessons & buy lessons


// buy a ticket
router.post("/buy-lesson", async (req, res) => {
    const { cID } = req.body;
    const lesson_price = 100; // placeholder
    const buyResult = await appService.insertDemotable(cID);
    const chargeResult = await appService.chargeCustomer(cID, lesson_price);
    if (buyResult && chargeResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/leave-review', async (req, res) => {
    const { cID, eID, review_content } = req.body;
    const insertResult = await appService.Customer.leaveRunReview(cID, eID, review_content);
    if (insertResult) {
        res.json({ success: true })
    } else {
        res.status(500).json({ success: false })
    }
});

router.get('/purchase-history', async (req, res) => {
    const { customer_id } = req.body;
    const tableContent = await appService.Customer.getPurchaseHistory(customer_id);
    res.json({ data: tableContent });
});

router.get('/view-resort-info', async (req, res) => {
    const { mountain_name } = req.body;
    const tableContent = await appService.getResortInfo(mountain_name);
    res.json({ data: tableContent });
});

router.post('/reset-all-data', async (req, res) => {
    const initiateResult = await appService.resetAllData();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})

/*
    ----- End of Jenna's work -----
*/

module.exports = router;