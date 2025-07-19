import React, { useEffect, useState } from 'react';
import { analyticsApi, CourseData } from '../services/api';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsApi.getCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Courses</h2>
      {loading && <div>Loading courses...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
                <div className="flex gap-2 items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{course.level || 'N/A'}</span>
                  {course.certificate ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 ml-2">Certificate</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 ml-2">No Certificate</span>
                  )}
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1">{course.institution} &bull; {course.category}</div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Duration:</span> {course.duration ? `${course.duration} weeks` : 'N/A'}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Skills:</span> {course.skills?.join(', ') || 'N/A'}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Instructor:</span> {course.instructor || 'N/A'}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Language:</span> {course.language || 'N/A'}
              </div>
              <div className="text-gray-500 text-sm mb-1">
                <span className="font-medium">Price:</span> {course.price ? `${course.price} ${course.currency}` : 'Free'}
              </div>
              <div className="text-gray-400 text-xs mb-2">Added on {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}</div>
              <div className="text-gray-700 text-sm mb-2 line-clamp-3">{course.description || 'No description.'}</div>
              {course.url && <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Course</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage; 