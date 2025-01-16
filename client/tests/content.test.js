const  fetchCourseContent  = require('../functions/content');

describe('Content Delivery Module', () => {
    test('should fetch course content for valid course ID', () => {
        const contents = [{ courseId: 101, data: 'React course material' }];
        const response = fetchCourseContent(101, contents);
        expect(response.success).toBe(true);
        expect(response.content).toBe('React course material');
    });

    test('should return error for invalid course ID', () => {
        const contents = [{ courseId: 101, data: 'React course material' }];
        const response = fetchCourseContent(102, contents);
        expect(response.success).toBe(false);
        expect(response.message).toBe('Content not found');
    });
});