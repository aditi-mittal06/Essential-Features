export const USER = {
  SHOW_FIRST_LAST_BUTTONS: true,
  DEFAULT_ROLE: 'Admin',
};

export const USER_TABLE_COLUMNS = [
  'firstName',
  'lastName',
  'email',
  'role',
  'status',
  'actions',
];

export const USER_DIALOG_CONFIG = {
  WIDTH: '600px',
  MAX_WIDTH: '95vw',
  DISABLE_CLOSE: true,
  CONFIRM_DIALOG_WIDTH: '400px',
  DELETE_DIALOG_WIDTH: '450px',
};

// ===== USER MESSAGES =====
export const USER_MESSAGES = {
  LOADING: 'Loading users...',
  RETRY_ACTION: 'Retry',
  CLOSE_ACTION: 'Close',
};

// ===== MOCK USER DATA =====
export const MOCK_USERS = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    role: 'Admin',
    status: true,
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    role: 'User',
    status: true,
  },
  {
    id: 3,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    role: 'Manager',
    status: false,
  },
  {
    id: 4,
    firstName: 'Diana',
    lastName: 'Wilson',
    email: 'diana.wilson@example.com',
    role: 'User',
    status: true,
  },
  {
    id: 5,
    firstName: 'Edward',
    lastName: 'Davis',
    email: 'edward.davis@example.com',
    role: 'Admin',
    status: false,
  },
  {
    id: 6,
    firstName: 'Fiona',
    lastName: 'Miller',
    email: 'fiona.miller@example.com',
    role: 'User',
    status: true,
  },
  {
    id: 7,
    firstName: 'George',
    lastName: 'Garcia',
    email: 'george.garcia@example.com',
    role: 'Manager',
    status: true,
  },
  {
    id: 8,
    firstName: 'Helen',
    lastName: 'Martinez',
    email: 'helen.martinez@example.com',
    role: 'User',
    status: false,
  },
  {
    id: 9,
    firstName: 'Ivan',
    lastName: 'Rodriguez',
    email: 'ivan.rodriguez@example.com',
    role: 'Admin',
    status: true,
  },
  {
    id: 10,
    firstName: 'Julia',
    lastName: 'Lopez',
    email: 'julia.lopez@example.com',
    role: 'User',
    status: true,
  },
  {
    id: 11,
    firstName: 'Kevin',
    lastName: 'Gonzalez',
    email: 'kevin.gonzalez@example.com',
    role: 'Manager',
    status: false,
  },
  {
    id: 12,
    firstName: 'Laura',
    lastName: 'Hernandez',
    email: 'laura.hernandez@example.com',
    role: 'User',
    status: true,
  },
];

// ===== TYPE DEFINITIONS =====
export type UserTableColumn = (typeof USER_TABLE_COLUMNS)[number];
// ===== VALIDATION CONSTANTS =====
export const USER_VALIDATION = {
  MIN_ID: 1,
  EMAIL_CASE_COMPARISON: 'toLowerCase',
} as const;

export const ADD_EDIT_FORM_VALIDATION = {
  EMAIL_MAX_LENGTH: 254,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DEBOUNCE_TIME_MS: 300,
  EMAIL_CHECK_DEBOUNCE_MS: 500,
} as const;

// ===== ADD/EDIT USER DIALOG RESPONSE DELAY =====
export const ADD_EDIT_DIALOG_RESPONSE_DELAY_MS = 1500;

// ===== ADD/EDIT USER DIALOG TITLES =====
export const ADD_EDIT_DIALOG_TITLES = {
  ADD_USER: 'Add New User',
  EDIT_USER: 'Edit User',
} as const;

// ===== ADD/EDIT USER MODE VALUES =====
export const ADD_EDIT_USER_MODES = {
  ADD: 'add',
  EDIT: 'edit',
} as const;

// ===== ADD/EDIT USER ROLE LABELS =====
export const ADD_EDIT_ROLE_LABELS = {
  ADMINISTRATOR: 'Administrator',
  MANAGER: 'Manager',
  USER: 'User',
} as const;

// ===== ADD/EDIT USER ROLE DESCRIPTIONS =====
export const ADD_EDIT_ROLE_DESCRIPTIONS = {
  ADMIN_FULL_ACCESS: 'Full system access',
  MANAGER_MANAGE_USERS: 'Manage users',
  USER_BASIC_ACCESS: 'Basic access',
} as const;

// ===== ADD/EDIT USER ROLE PERMISSIONS =====
export const ADD_EDIT_ROLE_PERMISSIONS = {
  ADMIN: 'Can manage all users and settings.',
  MANAGER: 'Can manage users and view reports.',
  USER: 'Standard user permissions.',
} as const;

// ===== ADD/EDIT USER ROLE ICONS =====
export const ADD_EDIT_ROLE_ICONS = {
  ADMIN: 'admin_panel_settings',
  MANAGER: 'supervisor_account',
  USER: 'person',
} as const;

// ===== ADD/EDIT USER AUTOCOMPLETE VALUES =====
export const ADD_EDIT_AUTOCOMPLETE = {
  EMAIL: 'email',
  FIRST_NAME: 'given-name',
  LAST_NAME: 'family-name',
} as const;

// ===== ADD/EDIT USER DIALOG RESPONSE =====
export const ADD_EDIT_DIALOG_RESPONSE = {
  SUCCESS: true,
  CANCELLED: true,
  FAILED: false,
} as const;

// ===== ADD/EDIT USER ICON SUFFIX =====
export const ADD_EDIT_ICON_SUFFIX = '-icon';
