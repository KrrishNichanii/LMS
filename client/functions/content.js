module.exports = function fetchCourseContent(courseId, contents) {
    const content = contents.find((c) => c.courseId === courseId);
    if (!content) return { success: false, message: "Content not found" };
    return { success: true, content: content.data };
}