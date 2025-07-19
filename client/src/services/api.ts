import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}api/employer/analytics`;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Types
export interface SummaryData {
    totalJobs: number;
    openJobs: number;
    filledJobs: number;
    archivedJobs: number;
    applicantsTotal: number;
    interviews: number;
    hires: number;
    shortlisted: number;
    recentApplications: number;
    recentHires: number;
}

export interface FunnelData {
    views: number;
    applications: number;
    shortlisted: number;
    interviewed: number;
    hired: number;
}

export interface SkillGapData {
    _id: string;
    avgSkillScore: number;
    candidateCount: number;
    maxScore: number;
    minScore: number;
}

export interface TopCourseData {
    _id: string;
    courseName: string;
    institution: string;
    hiresCount: number;
    avgPerformanceRating: number;
}

export interface HiringStatusData {
    _id: string;
    count: number;
}

export interface GeographyData {
    _id: string;
    applications: number;
    hires: number;
}

export interface DateRange {
    start?: string;
    end?: string;
    period?: 'week' | 'month' | 'quarter' | 'year';
}

export interface JobData {
    _id: string;
    title: string;
    status: string;
    department: string;
    createdAt: string;
    updatedAt?: string;
    experienceLevel?: string;
    jobType?: string;
    location?: {
        city?: string;
        country?: string;
        remote?: boolean;
    };
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
    };
    skillsRequired?: string[];
    views?: number;
    description?: string;
    // Add other fields as needed
}

export interface CourseData {
    _id: string;
    name: string;
    institution: string;
    category?: string;
    duration?: number;
    level?: string;
    skills?: string[];
    description?: string;
    url?: string;
    rating?: number;
    enrollmentCount?: number;
    completionRate?: number;
    price?: number;
    currency?: string;
    instructor?: string;
    language?: string;
    certificate?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CourseCompletionData {
    _id: string;
    candidateId: string;
    courseId: string;
    course: {
        _id: string;
        name: string;
        // Add other course fields as needed
    };
    jobId: string;
    job: {
        _id: string;
        title: string;
        // Add other job fields as needed
    };
    completedAt: string;
    wasHired: boolean;
    performanceRating?: number;
}

export interface ApplicationData {
    _id: string;
    candidateId?: string;
    jobId: string;
    job: {
        _id: string;
        title: string;
        department?: string;
        // Add other job fields as needed
    };
    status: string;
    appliedAt: string;
    location?: {
        city?: string;
        country?: string;
        coordinates?: number[];
    };
    skills?: string[];
    experience?: number;
    source?: string;
    rating?: number;
    resumeUrl?: string;
    coverLetter?: string;
    stage?: string;
    notes?: string;
    // Add other fields as needed
}

export interface ViewData {
    _id: string;
    jobId: string;
    job: {
        _id: string;
        title: string;
        department?: string;
        status?: string;
        // Add other job fields as needed
    };
    applicantId: string;
    application?: {
        _id: string;
        status?: string;
        appliedAt?: string;
        // Add other application fields as needed
    };
    candidate?: {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
        // Add other candidate fields as needed
    };
    viewedAt: string;
}

// API functions
export const analyticsApi = {
    // Get summary statistics
    getSummary: async (dateRange?: DateRange): Promise<SummaryData> => {
        const params = new URLSearchParams();
        if (dateRange?.start) params.append('start', dateRange.start);
        if (dateRange?.end) params.append('end', dateRange.end);
        if (dateRange?.period) params.append('period', dateRange.period);

        const response = await api.get(`/summary?${params.toString()}`);
        return response.data;
    },

    // Get application funnel for a specific job
    getFunnel: async (jobId: string): Promise<FunnelData> => {
        const response = await api.get(`/funnel/${jobId}`);
        return response.data;
    },

    // Get skill gap analysis for a specific job
    getSkillGap: async (jobId: string): Promise<SkillGapData[]> => {
        const response = await api.get(`/skill-gap/${jobId}`);
        return response.data;
    },

    // Get top courses that led to hires
    getTopCourses: async (dateRange?: DateRange): Promise<TopCourseData[]> => {
        const params = new URLSearchParams();
        if (dateRange?.start) params.append('start', dateRange.start);
        if (dateRange?.end) params.append('end', dateRange.end);
        if (dateRange?.period) params.append('period', dateRange.period);

        const response = await api.get(`/top-courses?${params.toString()}`);
        return response.data;
    },

    // Get hiring status breakdown
    getHiringStatus: async (dateRange?: DateRange): Promise<HiringStatusData[]> => {
        const params = new URLSearchParams();
        if (dateRange?.start) params.append('start', dateRange.start);
        if (dateRange?.end) params.append('end', dateRange.end);
        if (dateRange?.period) params.append('period', dateRange.period);

        const response = await api.get(`/hiring-status?${params.toString()}`);
        return response.data;
    },

    // Get geography data
    getGeography: async (dateRange?: DateRange): Promise<GeographyData[]> => {
        const params = new URLSearchParams();
        if (dateRange?.start) params.append('start', dateRange.start);
        if (dateRange?.end) params.append('end', dateRange.end);
        if (dateRange?.period) params.append('period', dateRange.period);

        const response = await api.get(`/geography?${params.toString()}`);
        return response.data;
    },

    // Export report
    exportReport: async (format: 'csv' | 'pdf', dateRange?: DateRange): Promise<Blob> => {
        const params = new URLSearchParams();
        params.append('format', format);
        if (dateRange?.start) params.append('start', dateRange.start);
        if (dateRange?.end) params.append('end', dateRange.end);
        if (dateRange?.period) params.append('period', dateRange.period);

        const response = await api.get(`/export-report?${params.toString()}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Get all jobs for the authenticated employer
    getJobs: async (): Promise<JobData[]> => {
        const response = await api.get(`${import.meta.env.VITE_APP_API_URL}api/employer/jobs`);
        return response.data;
    },

    // Get all courses
    getCourses: async (): Promise<CourseData[]> => {
        const response = await api.get(`${import.meta.env.VITE_APP_API_URL}api/employer/courses`);
        return response.data;
    },

    // Get all course completions
    getCourseCompletions: async (): Promise<CourseCompletionData[]> => {
        const response = await api.get(`${import.meta.env.VITE_APP_API_URL}api/employer/course-completions`);
        return response.data;
    },

    // Get all applications
    getApplications: async (): Promise<ApplicationData[]> => {
        const response = await api.get(`${import.meta.env.VITE_APP_API_URL}api/employer/applications`);
        return response.data;
    },

    // Get all views
    getViews: async (): Promise<ViewData[]> => {
        const response = await api.get(`${import.meta.env.VITE_APP_API_URL}api/employer/views`);
        return response.data;
    },
};

export default api; 