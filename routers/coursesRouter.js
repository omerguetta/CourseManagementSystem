const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const {
    addCourse,
    getAllCourses,
    getRegisteredCourses,
    registerForCourse,
    unregisterFromCourse,
    deleteCourse,
    getCourseDetails,
    editCourse,
} = require("../controllers/coursesController");

const router = express.Router();

router.post("/add", authenticateToken, authorizeRole("Staff"), addCourse);
router.get("/all", authenticateToken, authorizeRole("Staff"), getAllCourses);
router.put("/edit/:courseId", authenticateToken, authorizeRole("Staff"), editCourse);
router.delete("/delete/:courseId", authenticateToken, authorizeRole("Staff"), deleteCourse);

router.get("/my-courses/:userId", authenticateToken, authorizeRole("Student"), getRegisteredCourses);
router.post("/register", authenticateToken, authorizeRole("Student"), registerForCourse);
router.post("/unregister", authenticateToken, authorizeRole("Student"), unregisterFromCourse);

router.get("/:courseId", authenticateToken, getCourseDetails);

module.exports = router;

