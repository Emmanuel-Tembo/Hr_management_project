// Used for my database functions (queries) if it interacts with the database it goes here
const { pool } = require("../config/db.js");

const getAttendance = async() => {
    try {
       let [row] = await pool.query(
        `
        SELECT
            ED.emp_id AS EmployeeID, -- Added emp_id here
            ED.name AS EmployeeName,
            DATE_FORMAT(A.attendance_date, '%Y-%m-%d') AS attendance_date,
            A.attendance_status,
            A.clocked_in_time,
            A.attendance_state
        FROM
            Attendance AS A
        INNER JOIN
            EmployeeData AS ED ON A.emp_id = ED.emp_id
        WHERE
            A.attendance_date = '2025-07-29';
        `)
        // console.log("Raw data from database:", row);
       return row
    } catch (error) {
        return 'Tough luck'
    }
}
// console.log(await getAttendance());

const getAttendanceByDate = async (date = null) => {
    try {
        let sql = `
            SELECT
                ED.emp_id AS EmployeeID,
                ED.name AS EmployeeName,
                DATE_FORMAT(A.attendance_date, '%Y-%m-%d') AS attendance_date,
                A.attendance_status,
                A.clocked_in_time,
                A.attendance_state
            FROM
                Attendance AS A
            INNER JOIN
                EmployeeData AS ED ON A.emp_id = ED.emp_id
        `;

        const params = [];

        if (date !== null) {
            // Add WHERE clause if a date is provided
            sql += `
                WHERE A.attendance_date = ?`; // Placeholder for security
            params.push(date); // Add the date to the parameters array
        }

        // Execute the query using the pool, passing SQL and parameters
        const [rows, fields] = await pool.query(sql, params); // pool.query returns [rows, fields]

        return rows; // Return the fetched rows
    } catch (error) {
        console.error("Error in getAttendanceByDate model function:", error);
        // Re-throw the error so the controller can catch and handle it
        throw error;
    }
};

module.exports = {
    getAttendance,
    getAttendanceByDate
};
