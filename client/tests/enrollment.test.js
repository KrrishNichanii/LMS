const  enrollStudent  = require('../functions/enrollment');

describe('Enrollment Module', () => {
    test('should enroll a student in a course', () => {
        const enrollments = [];
        const response = enrollStudent(101, 1, enrollments);
        expect(response.success).toBe(true);
        expect(enrollments).toContainEqual({ courseId: 101, studentId: 1 });
    });

    test('should not enroll a student in the same course twice', () => {
        const enrollments = [{ courseId: 101, studentId: 1 }];
        const response = enrollStudent(101, 1, enrollments);
        expect(response.success).toBe(false);
        expect(response.message).toBe('Student already enrolled');
    });
});
