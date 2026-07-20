"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const projectRepository_1 = require("../repositories/projectRepository");
const apiResponse_1 = require("../utils/apiResponse");
const projectValidator_1 = require("../validators/projectValidator");
class ProjectController {
    // Create project along with packages atomically
    static async create(req, res, next) {
        try {
            const builderId = req.user?.userId;
            if (!builderId) {
                res.status(401).json((0, apiResponse_1.createApiResponse)(false, 'Unauthorized.'));
                return;
            }
            const validatedData = projectValidator_1.createProjectSchema.parse(req.body);
            const { packages, site_images, ...projectDetails } = validatedData;
            const createdProject = await projectRepository_1.ProjectRepository.createProject(builderId, projectDetails, packages, site_images);
            res.status(201).json((0, apiResponse_1.createApiResponse)(true, 'Project posted successfully.', createdProject));
        }
        catch (error) {
            next(error);
        }
    }
    // Get all projects posted by the logged-in builder
    static async getBuilderProjects(req, res, next) {
        try {
            const builderId = req.user?.userId;
            if (!builderId) {
                res.status(401).json((0, apiResponse_1.createApiResponse)(false, 'Unauthorized.'));
                return;
            }
            const projects = await projectRepository_1.ProjectRepository.getBuilderProjects(builderId);
            res.status(200).json((0, apiResponse_1.createApiResponse)(true, 'Builder projects retrieved successfully.', projects));
        }
        catch (error) {
            next(error);
        }
    }
    // Get project detailed page (with packages)
    static async getDetails(req, res, next) {
        try {
            const userId = req.user?.userId;
            const projectId = req.params.id;
            const project = await projectRepository_1.ProjectRepository.getProjectDetails(projectId);
            if (!project) {
                res.status(404).json((0, apiResponse_1.createApiResponse)(false, 'Project not found.'));
                return;
            }
            // Security Check: If project is in 'draft' or 'pending_approval', restrict access to the builder owner or admins only
            if (['draft', 'pending_approval'].includes(project.status) && project.builder_id !== userId && req.user?.role !== 'admin') {
                res.status(403).json((0, apiResponse_1.createApiResponse)(false, 'Access denied. Project visibility is restricted until it is published.'));
                return;
            }
            res.status(200).json((0, apiResponse_1.createApiResponse)(true, 'Project details retrieved successfully.', project));
        }
        catch (error) {
            next(error);
        }
    }
    // Edit project details
    static async update(req, res, next) {
        try {
            const builderId = req.user?.userId;
            const projectId = req.params.id;
            if (!builderId) {
                res.status(401).json((0, apiResponse_1.createApiResponse)(false, 'Unauthorized.'));
                return;
            }
            // Verify owner
            const project = await projectRepository_1.ProjectRepository.getProjectDetails(projectId);
            if (!project) {
                res.status(404).json((0, apiResponse_1.createApiResponse)(false, 'Project not found.'));
                return;
            }
            if (project.builder_id !== builderId) {
                res.status(403).json((0, apiResponse_1.createApiResponse)(false, 'Access denied. You do not own this project.'));
                return;
            }
            const validatedData = projectValidator_1.updateProjectSchema.parse(req.body);
            const updatedProject = await projectRepository_1.ProjectRepository.updateProject(projectId, validatedData);
            res.status(200).json((0, apiResponse_1.createApiResponse)(true, 'Project updated successfully.', updatedProject));
        }
        catch (error) {
            next(error);
        }
    }
    // Transition status (archive, publish draft, etc.)
    static async updateStatus(req, res, next) {
        try {
            const builderId = req.user?.userId;
            const projectId = req.params.id;
            if (!builderId) {
                res.status(401).json((0, apiResponse_1.createApiResponse)(false, 'Unauthorized.'));
                return;
            }
            // Verify owner
            const project = await projectRepository_1.ProjectRepository.getProjectDetails(projectId);
            if (!project) {
                res.status(404).json((0, apiResponse_1.createApiResponse)(false, 'Project not found.'));
                return;
            }
            if (project.builder_id !== builderId) {
                res.status(403).json((0, apiResponse_1.createApiResponse)(false, 'Access denied. You do not own this project.'));
                return;
            }
            const validatedData = projectValidator_1.updateProjectStatusSchema.parse(req.body);
            // Update status
            const updatedProject = await projectRepository_1.ProjectRepository.updateProjectStatus(projectId, validatedData.status);
            res.status(200).json((0, apiResponse_1.createApiResponse)(true, `Project status transitioned to ${validatedData.status} successfully.`, updatedProject));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProjectController = ProjectController;
exports.default = ProjectController;
