module.exports = function enrollStudent(courseId, studentId, enrollments) {
    if (enrollments.some((e) => e.courseId === courseId && e.studentId === studentId)) {
        return { success: false, message: "Student already enrolled" };
    }
    enrollments.push({ courseId, studentId });
    return { success: true, message: "Student enrolled successfully" };
}