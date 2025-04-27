/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

// const { setTicketPrice, deleteOwnsMountain, addOwnsMountain, addVillage, deleteVillage, addService, deleteService } = require("../appService");

// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    //loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    //statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            //statusElem.textContent = text;
        })
        .catch((error) => {
            //statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

/*
    Mar 20, 2025 by Andrew J.
    ----- Begin of Andrew's work. -----
    note: not sure if we need to make any changes below `window.onload = function()`
*/
// ----- Company -----
// booking status, referring fetchDemotable.
// Fetches data from the demotable and displays it.
async function fetchBookingStatus() {
    // AJ: Document Object Model API. document should be the HTML file.
    // id is bookingStatus, which needs to be the same as the id in HTML.
    const tableElement = document.getElementById('bookingStatus');
    // tbody is the tag in HTML.
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/booking-status', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// send gift card, refer to updateNameDemotable
async function sendGiftCard(event) {
    event.preventDefault();

    const user_id = document.getElementById('user_id').value;
    const card_value = document.getElementById('value').value;

    const response = await fetch('/send-gift-card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            value: card_value
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('sendGiftCardResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Gift card sent successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error sending gift card!";
    }
}


// ----- Customer (&Guests) -----

// customer registration
// refer to insertDemotable
async function registerCustomer(event) {
    event.preventDefault();

    const customer_ID = document.getElementById('customer_ID').value;
    const customer_name = document.getElementById('name').value;
    const customer_age = document.getElementById('age').value;
    const customer_skill = document.getElementById('skill').value;


    const response = await fetch('/register-customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cID: customer_ID,
            Name: customer_name,
            Age: customer_age,
            SkillLevel: customer_skill,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('registerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Customer registered successfully!";
        fetchTableData();
        initCustomerPage();
    } else {
        messageElement.textContent = "Error registering customer!";
    }
}

// customer login
// input: account & password from html
// output: T or F for login status
// refernece: countDemotable 
async function customerLogin() {
    const response = await fetch("/customer-login", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('loginResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Login successful!`;
        initCustomerPage();
    } else {
        messageElement.textContent = "Wrong account or password!";
    }
}

// show all tickets & buy tickets
// show all tickets (fetchAndDisplayUsers)
async function showAllTickets() {
    
    // AJ: referred to showAllLessons()
    const tableElement = document.getElementById('ticketTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/show-tickets-selling', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear oldla, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function showYoungestStudents() {
    // AJ: refer to showAllTickets()
    const tableElement = document.getElementById('youngestTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-youngest-student-ages', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear oldla, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// AJ: expect to have a T or F, showing if the ticket is DayPass or not. 
// buy tickets (insertDemotable)
async function buyTicket(event) {
    event.preventDefault();

    const customer_ID = document.getElementById('customer_ID').value;
    const ticketType = document.getElementById('isDayPass').value;
    // const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/buy-a-ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cID: customer_ID,
            isDayPass: ticketType
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('buyTicketResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Ticket bought successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error buying ticket!";
    }
}

// show all lessons bought by a customer & cancel future lessons
// show all lessons 
async function showAllLessons() {
    
    // AJ: referred to fetchInstructors()
    const tableElement = document.getElementById('lessonTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/show-lessons', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    })
}


async function buyLesson(event) {
    event.preventDefault();

    const customer_ID = document.getElementById('customer_ID').value;
    const ticketType = document.getElementById('isDayPass').value;
    // const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/buy-a-ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cID: customer_ID,
            isDayPass: ticketType
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('buyTicketResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Ticket bought successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error buying ticket!";
    }
}

// cancel future lessons (insertDemotable, but a delete here)
async function cancelLesson(event) {
    event.preventDefault();

    const customer_id = document.getElementById('customer_id').value;
    const lesson_id = document.getElementById('lesson_id').value;

    const response = await fetch('/cancel-a-lesson', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cID: customer_id,
            lID: lesson_id
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('cancelResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Lesson cancelled successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error canceling lesson!";
    }
}

async function getYoungests(event) {
    const tableElement = document.getElementById('youngestStudents');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-youngest-students', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

// show all nodes & search ski routes
// show all nodes (fetchAndDisplayUsers)
async function showAllNodes() {
    const tableElement = document.getElementById('allNodes');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/all-nodes', {
        method: 'GET'
    });

    const responseData = await response.json();
    const nodeContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    nodeContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// search ski routes (fetchAndDisplayUsers)
async function getSkiRoutes() {
    const tableElement = document.getElementById('skiroutes');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-ski-routes', {
        method: 'GET'
    });

    const responseData = await response.json();
    const skiRoutesContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    skiRoutesContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
async function getBestRun(){
    const tableElement = document.getElementById('bestRunDisplay');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/best-run', {
        method: 'GET'
    });

    const responseData = await response.json();
    const bestRunContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    bestRunContent.forEach(run => {
        const row = tableBody.insertRow();
        run.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
// show all runs & check reviews of a run
// show all runs (fetchAndDisplayUsers)
async function showAllRuns() {
    const tableElement = document.getElementById("mountainRunsGuest");
    const tableBody = tableElement.querySelector('tbody');

    // AJ: didn't incclude Jenna's change at 9a87ff6. this should be a get method.
    const response = await fetch('/all-runs', {
        method: 'GET'
    });

    const responseData = await response.json();
    const runsContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    runsContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// check reviews of a run (fetchAndDisplayUsers)
async function getAllReviewsOfARun() {
    const tableElement = document.getElementById('runReviewsGuest');
    const tableBody = tableElement.querySelector('tbody');
    const run = document.getElementById("runForReviewsGuest").value;

    // AJ: same as 9a87ff6 above.
    const response = await fetch('/all-reviews-of-a-run', {
        method: 'GET'
    });

    const responseData = await response.json();
    const reviewsContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    reviewsContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// ----- Others -----
async function mapSkillToInteger(skill) {
    try {
        if (skill == "Beginner")
            return 1;
        else if (skill == "Intermediate")
            return 2;
        else if (skill == "Advanced")
            return 3;
        else
            throw error("Invalid skill level");
    } catch (error) {
        console.log("Wrong skill level: " + skill);
    }
}

async function mapIntegerToSkill(level) {
    try {
        if (level == 1)
            return "Beginner";
        else if (level == 2)
            return "Intermediate";
        else if (level == 3)
            return "Advanced";
        else
            throw error("Invalid skill level");
    } catch (error) {
        console.log("Wrong skill level: " + level);
    }
}

/*
    ----- End of Andrew's work. -----
*/

/*
    ----- Begin Jenna's work -----
*/

// COMPANY

async function registerCompany(event) {
    event.preventDefault();

    const company_name = document.getElementById('name').value;
    const company_email = document.getElementById('email').value;
    const company_phone = document.getElementById('phone').value;
    const company_address = document.getElementById('address');


    const response = await fetch('/register-company', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Name: company_name,
            Email: company_email,
            Phone: company_phone,
            Address: company_address,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('registerCompanyResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Company registered successfully!";
        fetchTableData();
        initCompanyPage();
    } else {
        messageElement.textContent = "Error registering company!";
    }
}

async function companyLogin() {
    const response = await fetch("/company-login", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('loginResultMsg');

    if (responseData.success)
        messageElement.textContent = `Logged in successfully!`;
    else
        messageElement.textContent = "Wrong account or password!";
}

async function setTicketPrice(event) {
    event.preventDefault();

    const company_name = document.getElementById('ticketPriceCompany').value;
    const ticket_price = document.getElementById('newTicketPrice').value;

    const response = await fetch('/set-ticket-price', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Name: company_name,
            Price: ticket_price
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('setPriceResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Ticket price set!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error setting ticket price!";
    }
}

// INSTRUCTOR MANAGEMENT ==============================================

// populates instructorTable
async function fetchInstructors() {

    const tableElement = document.getElementById('instructorTable');

    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/show-instructors', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(instructor => {
        const row = tableBody.insertRow();
        instructor.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// from insertDemotable
async function addInstructor(event) {
    event.preventDefault();

    const idValue = document.getElementById('addInstructorID').value;
    const nameValue = document.getElementById('addInstructorName').value;
    const phoneValue = document.getElementById('instructorPhone').value;
    const emailValue = document.getElementById('instructorEmail').value;

    const response = await fetch('/add-instructor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instructor_id: idValue,
            instructor_name: nameValue,
            instructor_phone: phoneValue,
            instructor_email: emailValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addInstructorResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Instructor added successfully!";
        fetchInstructors();
    } else {
        messageElement.textContent = "Error adding instructor!";
    }
}

async function updateInstructor(event) {
    event.preventDefault();

    const idValue = document.getElementById('updateInstructorID').value;
    const emailValue = document.getElementById('updateInstructorEmail').value;
    const phoneValue = document.getElementById('updateInstructorPhone').value;

    const response = await fetch('/update-instructor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instructor_id: idValue,
            instructor_email: emailValue,
            instructor_phone: phoneValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateInstructorResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Instructor updated successfully!";
        fetchInstructors();
    } else {
        messageElement.textContent = "Error updating instructor!";
    }
}

async function deleteInstructor(event) {
    event.preventDefault();

    const idValue = document.getElementById('deleteInstructorID').value;

    const response = await fetch('/delete-instructor', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instructor_id: idValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteInstructorResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Instructor deleted successfully!";
        fetchInstructors();
    } else {
        messageElement.textContent = "Error deleting instructor!";
    }
}

async function getLevelInstructors() {

    const tableElement = document.getElementById('levelInstructors');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-all-level-instructors', {
        method:'GET'
    })

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(instructor => {
        const row = tableBody.insertRow();
        instructor.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// MOUNTAIN MANAGEMENT ===================================================

// populates mountainTable
async function fetchMountains(event) {
    event.preventDefault();

    const nameValue = document.getElementById('mountainCompanyName').value;

    const tableElement = document.getElementById('mountainTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/show-mountains', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company_name: nameValue
        })

    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(mountain => {
        const row = tableBody.insertRow();
        mountain.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function addMountain(event) {
    event.preventDefault();

    const companyValue = document.getElementById('addMountainCompany').value;
    const addressValue = document.getElementById('addMountainAddress').value;
    const nameValue = document.getElementById('addMountainName').value;
    const capacityValue = document.getElementById('addMountainCapacity').value;

    const response = await fetch('/add-mountain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company_name: companyValue,
            mountain_address: addressValue,
            mountain_name: nameValue,
            mountain_capacity: capacityValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addMtnResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Mountain added successfully!";
        fetchMountains();
    } else {
        messageElement.textContent = "Error adding mountains!";
    }

}

async function updateMountain(event) {
    event.preventDefault();

    const mountainAddress = document.getElementById('mountainAddress').value;
    const newCapacity = document.getElementById('mountainCapacity').value;
    const newName = document.getElementById('mountainName').value;

    const response = await fetch('/update-mountain_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: mountainAddress,
            capacity: newCapacity,
            name: newName
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

async function deleteMountain(event) {
    event.preventDefault();

    const instructor_id = document.getElementById('deleteMountainAddress').value;

    const response = await fetch('/delete-mountain', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            iID: instructor_id
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteMountainResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Mountain deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting mountain!";
    }
}

// VILLAGE MANAGEMENT =====================================

// populates villageTable
// async function fetchVillages() {

// }


async function addVillage(event) {

    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/add-village', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addVillageResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Village added successfully!";
    } else {
        messageElement.textContent = "Error adding villages!";
    }
}

async function deleteVillage(event) {
    event.preventDefault();

    const village_id = document.getElementById('deleteVillageID').value;

    const response = await fetch('/delete-village', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vID: village_id
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteVillageResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Vilage deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting village!";
    }
}

// SERVICE MANAGEMENT ======================================

async function addService(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const typeValue = document.getElementById('insertType').value;
    const timeValue = document.getElementById('insertTime').value;

    const response = await fetch('/add-village', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            type: typeValue,
            time: timeValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addVillageResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Village added successfully!";
    } else {
        messageElement.textContent = "Error adding villages!";
    }
}

async function deleteService(event) {

    event.preventDefault();

    const instructor_id = document.getElementById('deleteMountainAddress').value;

    const response = await fetch('/delete-mountain', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            iID: instructor_id
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteMountainResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Mountain deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting mountain!";
    }
}


// ======================= CUSTOMER ==========================

async function leaveReview(event) {
    const customer_id = document.getElementById("")
    const score = document.getElementById("inputScore").value;
    const comments = document.getElementById("inputComments").value;

    const response = await fetch('/leave-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        })
    })
}

async function filterByScore(event) {
    event.preventDefault();

    const minValue = document.getElementById('minScore').value;

    const response = await fetch('/all-runs-higher-avg-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            minValue: minValue,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addVillageResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Village added successfully!";
    } else {
        messageElement.textContent = "Error adding villages!";
    }
}

async function resetAllData() {

    const response = await fetch('/reset-all-data', {
        method: 'POST'
    });

    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resultResetAllDataMsg');
        messageElement.textContent = "Database reset successfully!";
        fetchTableData();
    } else {
        alert("Error resetting database!");
    }

    // AJ: not sure if JC has other thoughts on the following code.
    // const loginMsg = document.getElementById("resetLoginMsg");
    // // const customerMsg = document.getElementById("resetCompanyMsg");
    // // const companyMsg = document.getElementById("resetCompanyMsg");
    // // const guestMsg = document.getElementById("resetGuestMsg");

    // if (responseData.success) {
    //     // if (loginMsg) {
    //     loginMsg.textContent = "Database reset successfully.";
    //     fetchAndDisplayUsers(); // replace with relevant table resets
    //     // } else if (customerMsg) {
    //     //     customerMsg.textContent = "Database reset successfully.";
    //     //     fetchAndDisplayUsers(); // replace with relevant table resets
    //     // } else if (companyMsg) {
    //     //     companyMsg.textContent = "Database reset successfully.";
    //     //     fetchAndDisplayUsers(); // replace with relevant table resets
    //     // } else if (guestMsg) {
    //     //     guestMsg.textContent = "Database reset successfully.";
    //     //     fetchAndDisplayUsers(); // replace with relevant table resets
    //     // }

    // } else {
    //     // if (loginMsg) {
    //     loginMsg.textContent = "Error resetting database!";
    //     // } else if (customerMsg) {
    //     //     customerMsg.textContent = "Error resetting database!";
    //     // } else if (companyMsg) {
    //     //     companyMsg.textContent = "Error resetting database!";
    //     // } else if (guestMsg) {
    //     //     guestMsg.textContent = "Error resetting database!";
    //     // }
    // }
}

// Opens and initializes pages

// AJ: simple methods. need to be combined with the following init()s.
function customerPage() {
    window.location.replace('customer.html');
    showAllLessons();
    showAllTickets();
}

function companyPage() {
    window.location.assign('./company.html');
    fetchInstructors();
    fetchMountains();
    showYoungestStudents();
}

function guestPage() {
    location.href = './guest.html';
}

function initGuestPage() {
    // AJ: not sure about this
    // window.location = "guest.html";
    // window.location.href = "/guest";
    // AJ: the following is deleted by JC.
    // document.getElementById("viewResortInfo")?.addEventListener("click",);
    // document.getElementById("routeSearch")?.addEventListener("submit",);
    // document.getElementById("listRuns")?.addEventListener("submit",)
    // document.getElementById("listReviews")?.addEventListener("submit",);
}

function initCompanyPage() {
    // window.location.href = '/company'
    fetchBookingStatus();
    fetchInstructors();
    fetchMountains();
    // AJ: the following is deleted by JC.
    // document.getElementById("setTicketPrice").addEventListener("submit", setTicketPrice);
    // document.getElementById("addInstructor").addEventListener("submit", addInstructor);
    // document.getElementById("updateInstructor").addEventListener("submit", updateInstructor);
    // document.getElementById("deleteInstructor").addEventListener("submit", deleteInstructor);
    // document.getElementById("addMountain").addEventListener("submit", addOwnsMountain);
    // document.getElementById("deleteMountain").addEventListener("submit", deleteOwnsMountain);
    // document.getElementById("addVillage").addEventListener("submit", addVillage);
    // document.getElementById("deleteVillage").addEventListener("submit", deleteVillage);
    // document.getElementById("addService").addEventListener("submit", addService);
    // document.getElementById("deleteService").addEventListener("submit", deleteService);
    // document.getElementById("sendGiftCard").addEventListener("submit", sendGiftCard);
}

function initCustomerPage() {
    // AJ: not sure about this now.
    // window.location = "customer.html";
    // window.location.href = "/customer";
    // showAllTickets();
    // showAllLessons();
    // AJ: the following is deleted by JC.
    // document.getElementById("buyATicket").addEventListener("submit", buyTicket);
    // document.getElementById("buyLesson").addEventListener("submit", )
}



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    // fetchTableData();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    // AJ: test sendGiftCard()
    document.getElementById("sendGiftCard")?.addEventListener("submit", countDemotable);
    document.getElementById("addInstructor")?.addEventListener("submit", addInstructor);
    document.getElementById("updateInstructor")?.addEventListener("submit", updateInstructor);
    document.getElementById("deleteInstructor")?.addEventListener("submit", deleteInstructor);

    // Company
    document.getElementById("getMountains")?.addEventListener("submit", fetchMountains);
    document.getElementById("addMountain")?.addEventListener("submit", addMountain);
    document.getElementById("getYoungest")?.addEventListener("click", getYoungests);
    showYoungestStudents();

    // Customer page
    // document.getElementById("availableLessons")?.addEventListener("click", showAllLessons);
   
    showAllLessons();
    showAllTickets();

    // AJ: not sure about this now.
    // window.location = "login.html";
    // checkDbConnection();
    // document.getElementById("gotoGuest").addEventListener("click", initGuestPage);
    // document.getElementById("customerLogin").addEventListener("submit", customerLogin);
    // document.getElementById("companyLogin").addEventListener("submit", companyLogin);
    // document.getElementById("registerCompany").addEventListener("submit", registerCompany);
    // document.getElementById("registerCustomer").addEventListener("submit", registerCustomer);
};

// document.addEventListener("DOMContentLoaded", function() {
//     checkDbConnection();
//     // LOGIN
//     document.getElementById("gotoGuest")?.addEventListener("click", initGuestPage);
//     document.getElementById("customerLogin")?.addEventListener("submit", customerLogin);
//     document.getElementById("companyLogin")?.addEventListener("submit", companyLogin);
//     document.getElementById("registerCompany")?.addEventListener("submit", registerCompany);
//     document.getElementById("registerCustomer")?.addEventListener("submit", registerCustomer);

//     // AJ: a lot of chanfges at 9a87ff6 here.
//     // GUEST
//     // const allResortInfoButton = document.getElementById("viewMountainInfo");
//     // allResortInfoButton?.addEventListener("submit",);
//     // const searchRouteGuest = document.getElementById("routeSearchGuest");
//     // searchRouteGuest?.addEventListener("submit", )
// });

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
