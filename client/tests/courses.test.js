const  createCourse  = require('../functions/courses');
// import createCourse from '../functions/courses'
describe('Course Management Module', () => {
    test('should create a new course', () => {
        const courses = [];
        const course = { id: 1, name: 'React Basics' };
        const response = createCourse(courses, course);
        expect(response.success).toBe(true);
        expect(courses).toContainEqual(course);
    });

    test('should not create a course with duplicate ID', () => {
        const courses = [{ id: 1, name: 'React Basics' }];
        const course = { id: 1, name: 'React Advanced' };
        const response = createCourse(courses, course);
        expect(response.success).toBe(false);
        expect(response.message).toBe('Course already exists');
    });
});