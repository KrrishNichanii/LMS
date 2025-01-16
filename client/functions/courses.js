module.exports = function createCourse(courses, course) {
    if (courses.some((c) => c.id === course.id)) {
        return { success: false, message: "Course already exists" };
    }
    courses.push(course);
    return { success: true, message: "Course created successfully" };
}