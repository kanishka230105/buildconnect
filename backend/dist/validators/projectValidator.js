"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectStatusSchema = exports.updateProjectSchema = exports.createProjectSchema = exports.projectImageSchema = exports.packageCreationSchema = void 0;
const zod_1 = require("zod");
const WORK_PACKAGE_SERVICES = {
    'Site Preparation & Clearing': ['Site Clearing', 'Vegetation Removal', 'Debris Removal', 'Existing Structure Removal', 'Site Levelling', 'Topsoil Removal', 'Temporary Access Preparation', 'Construction Site Setup'],
    'Excavation & Earthwork': ['Foundation Excavation', 'Bulk Earth Excavation', 'Trench Excavation', 'Soil Removal', 'Backfilling', 'Soil Compaction', 'Earth Levelling', 'Excavated Material Disposal'],
    'Foundation Works': ['Isolated Footing Construction', 'Combined Footing Construction', 'Strip Footing Construction', 'Raft Foundation Construction', 'Pile Foundation Works', 'Pile Cap Construction', 'Foundation Concrete Works', 'Foundation Reinforcement Works'],
    'RCC Structural Works': ['Reinforcement Steel Fixing', 'Formwork & Shuttering', 'Concrete Pouring', 'Column Construction', 'Beam Construction', 'Slab Construction', 'Staircase RCC Works', 'RCC Structural Finishing'],
    'Masonry & Blockwork': ['Brick Masonry', 'Concrete Blockwork', 'AAC Blockwork', 'Internal Partition Walls', 'External Wall Construction', 'Parapet Wall Construction', 'Masonry Opening Works', 'Masonry Repair & Finishing'],
    'Structural Steel Works': ['Structural Steel Fabrication', 'Steel Column Installation', 'Steel Beam Installation', 'Steel Truss Construction', 'On-Site Steel Erection', 'Steel Connection Works', 'Structural Steel Welding', 'Steel Surface Protection'],
    'Waterproofing Works': ['Terrace Waterproofing', 'Bathroom Waterproofing', 'Basement Waterproofing', 'Water Tank Waterproofing', 'External Wall Waterproofing', 'Roof Waterproofing', 'Expansion Joint Waterproofing', 'Waterproofing Testing'],
    'Electrical Works': ['Electrical Wiring', 'Distribution Panel Installation', 'Switch & Socket Installation', 'Lighting Installation', 'Earthing System Installation', 'Lightning Protection', 'Cable Tray Installation', 'Electrical Testing & Commissioning'],
    'Plumbing Works': ['Water Supply Piping', 'Sanitary Piping', 'Bathroom Plumbing', 'Water Tank Connection', 'Plumbing Fixture Installation', 'Drainage Pipe Installation', 'Pump Connection Works', 'Plumbing Testing & Commissioning'],
    'HVAC Works': ['Air Conditioning Installation', 'HVAC Ducting', 'Ventilation System Installation', 'Chilled Water Piping', 'Refrigerant Piping', 'HVAC Equipment Installation', 'Air Distribution System Installation', 'HVAC Testing & Commissioning'],
    'Fire & Safety Works': ['Fire Sprinkler Installation', 'Fire Hydrant Installation', 'Fire Alarm System Installation', 'Smoke Detector Installation', 'Fire Pump Installation', 'Fire Hose Reel Installation', 'Emergency Safety System Installation', 'Fire System Testing & Commissioning'],
    'Flooring & Tiling Works': ['Ceramic Tile Installation', 'Vitrified Tile Installation', 'Marble Flooring', 'Granite Flooring', 'Industrial Flooring', 'Bathroom Tiling', 'Wall Tiling', 'Flooring Finishing & Polishing'],
    'Painting Works': ['Interior Wall Painting', 'Exterior Wall Painting', 'Wall Putty Application', 'Primer Application', 'Ceiling Painting', 'Metal Surface Painting', 'Protective Coating', 'Final Paint Finishing'],
    'False Ceiling Works': ['Gypsum False Ceiling', 'POP Ceiling Works', 'Grid Ceiling Installation', 'Acoustic Ceiling Installation', 'Decorative Ceiling Works', 'Ceiling Framework Installation', 'Ceiling Panel Installation', 'False Ceiling Finishing'],
    'Carpentry & Woodwork': ['Door Frame Installation', 'Wooden Door Installation', 'Cabinet & Storage Works', 'Modular Woodwork', 'Custom Furniture Works', 'Wooden Partition Works', 'Wooden Wall Panelling', 'Wood Finishing & Polishing'],
    'Glass, Aluminium & Façade Works': ['Aluminium Window Installation', 'Aluminium Door Installation', 'Glass Door Installation', 'Curtain Wall Installation', 'ACP Cladding', 'Structural Glazing', 'Glass Partition Installation', 'Façade Finishing Works'],
    'Interior Fit-Out Works': ['Office Fit-Out', 'Residential Interior Execution', 'Partition Installation', 'Wall Panelling', 'Interior Finishing Works', 'Interior Fixture Installation', 'Decorative Works', 'Final Interior Completion Works'],
    'Road & Paving Works': ['Internal Road Construction', 'Asphalt Paving', 'Concrete Road Construction', 'Interlocking Paver Installation', 'Kerb Stone Installation', 'Walkway Construction', 'Parking Area Paving', 'Road Finishing Works'],
    'Landscaping Works': ['Lawn Development', 'Tree & Plant Installation', 'Irrigation System Installation', 'Hardscape Works', 'Garden Development', 'Soil Preparation for Landscaping', 'Landscape Lighting Preparation', 'Garden Maintenance Setup'],
    'CCTV, Security & ELV Works': ['CCTV Camera Installation', 'Access Control Installation', 'Intercom System Installation', 'Structured Network Cabling', 'Public Address System Installation', 'Video Door Phone Installation', 'Security Alarm System Installation', 'ELV Testing & Commissioning']
};
exports.packageCreationSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Package name must be at least 2 characters.'),
    description: zod_1.z.string().trim().min(5, 'Package description must be at least 5 characters.'),
    budget: zod_1.z.number().positive('Package budget must be a positive number.'),
    timeline_start: zod_1.z.string().datetime({ offset: true }).optional().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()).or(zod_1.z.literal('')),
    timeline_end: zod_1.z.string().datetime({ offset: true }).optional().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()).or(zod_1.z.literal('')),
    scope: zod_1.z.string().trim().min(5, 'Package scope statement is required.'),
    required_experience: zod_1.z.string().trim().optional(),
    skills: zod_1.z.array(zod_1.z.string().uuid('Skill ID must be a valid UUID.')).optional(),
    selected_services: zod_1.z.array(zod_1.z.string().trim().min(1)).optional(),
    custom_services: zod_1.z.string().trim().optional()
}).superRefine((data, ctx) => {
    const allowedServices = WORK_PACKAGE_SERVICES[data.name];
    if (!allowedServices) {
        return;
    }
    const selectedServices = data.selected_services || [];
    const hasCustomServices = Boolean(data.custom_services?.trim());
    if (selectedServices.length === 0 && !hasCustomServices) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['selected_services'],
            message: 'Please select at least one package service or provide custom services.'
        });
        return;
    }
    const invalidServices = selectedServices.filter((service) => !allowedServices.includes(service));
    if (invalidServices.length > 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['selected_services'],
            message: 'Only services belonging to the selected package are allowed.'
        });
    }
});
exports.projectImageSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Image file name is required.'),
    fileType: zod_1.z.string().trim().min(1, 'Image file type is required.'),
    fileData: zod_1.z.string().trim().min(1, 'Base64 image data is required.').refine((val) => {
        return /^data:[^;]+;base64,/.test(val) || /^[A-Za-z0-9+/=]+$/.test(val);
    }, { message: 'Invalid base64 image data.' })
});
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(3, 'Project name must be at least 3 characters.'),
    description: zod_1.z.string().trim().min(10, 'Project description must be at least 10 characters.'),
    budget: zod_1.z.number().positive('Project budget must be a positive number.'),
    timeline_start: zod_1.z.string().datetime({ offset: true }).optional().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()).or(zod_1.z.literal('')),
    timeline_end: zod_1.z.string().datetime({ offset: true }).optional().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()).or(zod_1.z.literal('')),
    property_type: zod_1.z.string().trim().optional(),
    location: zod_1.z.string().trim().min(2, 'Project location is required.'),
    status: zod_1.z.enum(['draft', 'pending_approval', 'published', 'archived'], {
        errorMap: () => ({ message: "Status must be 'draft', 'pending_approval', 'published', or 'archived'." })
    }),
    site_images: zod_1.z.array(exports.projectImageSchema).optional(),
    packages: zod_1.z.array(exports.packageCreationSchema).min(1, 'A project must have at least one work package.')
});
exports.updateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(3).optional(),
    description: zod_1.z.string().trim().min(10).optional(),
    budget: zod_1.z.number().positive().optional(),
    timeline_start: zod_1.z.string().optional(),
    timeline_end: zod_1.z.string().optional(),
    property_type: zod_1.z.string().optional(),
    location: zod_1.z.string().optional()
});
exports.updateProjectStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['draft', 'pending_approval', 'published', 'archived'])
});
