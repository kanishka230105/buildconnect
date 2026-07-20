import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AdminRepository } from '../repositories/adminRepository';
import { ProjectRepository } from '../repositories/projectRepository';
import { createApiResponse } from '../utils/apiResponse';
import { reviewVerificationSchema, suspendUserSchema } from '../validators/adminValidator';

export class AdminController {
  // Get all pending profiles awaiting verification
  static async getPendingList(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const verifications = await AdminRepository.getPendingVerifications();
      res.status(200).json(
        createApiResponse(true, 'Pending verifications retrieved successfully.', verifications)
      );
    } catch (error) {
      next(error);
    }
  }

  // Approve or reject builder/contractor verification profile
  static async reviewProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = req.params.id;
      const validatedData = reviewVerificationSchema.parse(req.body);
      const { entityType, action, remarks } = validatedData;

      const result = await AdminRepository.reviewVerification(entityType, entityId, action, remarks);

      const message = action === 'approve'
        ? `${entityType} profile has been successfully approved.`
        : `${entityType} profile has been rejected with logged remarks.`;

      res.status(200).json(createApiResponse(true, message, result));
    } catch (error) {
      next(error);
    }
  }

  // Get all registered users list
  static async getUsersList(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await AdminRepository.getAllUsers();
      res.status(200).json(createApiResponse(true, 'Users retrieved successfully.', users));
    } catch (error) {
      next(error);
    }
  }

  // Get all posted reviews list
  static async getReviewsList(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviews = await AdminRepository.getAllReviews();
      res.status(200).json(createApiResponse(true, 'Reviews retrieved successfully.', reviews));
    } catch (error) {
      next(error);
    }
  }

  // Get pending project approvals
  static async getPendingProjects(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pendingProjects = await ProjectRepository.getPendingApprovalProjects();
      res.status(200).json(createApiResponse(true, 'Pending projects retrieved successfully.', pendingProjects));
    } catch (error) {
      next(error);
    }
  }

  // Approve or reject a project submission
  static async reviewProjectApproval(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.id;
      const { action } = req.body;
      if (!action || !['approve', 'reject'].includes(action)) {
        res.status(400).json(createApiResponse(false, "Action must be either 'approve' or 'reject'."));
        return;
      }

      const targetStatus = action === 'approve' ? 'published' : 'draft';
      const updatedProject = await ProjectRepository.updateProjectStatus(projectId, targetStatus as any);

      res.status(200).json(
        createApiResponse(true, `Project has been ${action === 'approve' ? 'approved and published' : 'rejected and returned to draft'}.`, updatedProject)
      );
    } catch (error) {
      next(error);
    }
  }

  // Suspend or unsuspend user
  static async setUserSuspension(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const validatedData = suspendUserSchema.parse(req.body);
      const { suspend } = validatedData;

      const result = await AdminRepository.suspendUser(userId, suspend);
      const msg = suspend ? 'User account has been suspended.' : 'User account has been unsuspended.';

      res.status(200).json(createApiResponse(true, msg, result));
    } catch (error) {
      next(error);
    }
  }

  // Delete review
  static async removeReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = req.params.id;
      const result = await AdminRepository.deleteReview(reviewId);

      res.status(200).json(createApiResponse(true, 'Review has been successfully deleted.', result));
    } catch (error) {
      next(error);
    }
  }

  // Force cancel package
  static async forceCancelPackage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const packageId = req.params.id;
      const result = await AdminRepository.cancelPackage(packageId);

      res.status(200).json(createApiResponse(true, 'Work package has been cancelled by administrator.', result));
    } catch (error) {
      next(error);
    }
  }

  // Approve contractor edit request
  static async approveEditRequest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contractorId = req.params.id;
      const result = await AdminRepository.approveContractorEdit(contractorId);

      res.status(200).json(createApiResponse(true, 'Contractor edit request has been approved.', result));
    } catch (error) {
      next(error);
    }
  }
}
export default AdminController;
