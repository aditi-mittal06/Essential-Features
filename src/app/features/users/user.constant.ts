export const USER_TABLE_COLUMNS = [
  'firstName',
  'lastName',
  'email',
  'role',
  'status',
  'actions'
];

// ===== SORTING CONFIGURATION =====
export const USER_SORT_CONFIG = {
  DEFAULT_SORT_BY: 'firstName',
  DEFAULT_SORT_DIRECTION: 'asc',
  AVAILABLE_SORT_FIELDS: ['firstName', 'lastName', 'email']
}

// ===== SNACKBAR CONFIGURATION =====
export const SNACKBAR_CONFIG = {
  DURATION: 3000,
  SUCCESS_DURATION: 4000,
  ERROR_DURATION: 4000,
  SUCCESS_CLASS: 'success-snackbar',
  ERROR_CLASS: 'error-snackbar'
}

// ===== DIALOG CONFIGURATION =====
export const USER_DIALOG_CONFIG = {
  WIDTH: '600px',
  MAX_WIDTH: '95vw',
  DISABLE_CLOSE: true,
  CONFIRM_DIALOG_WIDTH: '400px',
  DELETE_DIALOG_WIDTH: '450px'
}

// ===== ADD/EDIT USER DIALOG CONFIGURATION =====
export const ADD_EDIT_USER_DIALOG_CONFIG = {
  MIN_WIDTH: '500px',
  MAX_WIDTH: '600px',
  MOBILE_MIN_WIDTH: '320px',
  MOBILE_MAX_WIDTH: '95vw'
} as const;

// ===== ADD/EDIT USER DIALOG TITLES =====
export const ADD_EDIT_USER_TITLES = {
  ADD_MODE: 'Add New User',
  EDIT_MODE: 'Edit User'
} as const;

// ===== FORM FIELD CONFIGURATIONS =====
export const FORM_FIELD_CONFIGS = {
  EMAIL: {
    LABEL: 'Email Address',
    PLACEHOLDER: 'Enter email address',
    MAX_LENGTH: 254,
    REQUIRED: true,
    TYPE: 'email'
  },
  FIRST_NAME: {
    LABEL: 'First Name',
    PLACEHOLDER: 'Enter first name',
    MAX_LENGTH: 100,
    REQUIRED: true,
    TYPE: 'text'
  },
  LAST_NAME: {
    LABEL: 'Last Name',
    PLACEHOLDER: 'Enter last name',
    MAX_LENGTH: 100,
    REQUIRED: true,
    TYPE: 'text'
  },
  ROLE: {
    LABEL: 'User Role',
    PLACEHOLDER: 'Select a role',
    REQUIRED: true,
    TYPE: 'select'
  }
} as const;

// ===== FORM VALIDATION CONSTANTS =====
export const FORM_VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_EMAIL_LENGTH: 254,
  MAX_NAME_LENGTH: 100,
  DEBOUNCE_TIME: 300,
  EMAIL_CHECK_DEBOUNCE: 500
} as const;

// ===== ROLE CONFIGURATION =====
export const ROLE_OPTIONS = {
  ADMIN: {
    VALUE: 'Admin',
    LABEL: 'Administrator',
    DESCRIPTION: 'Full system access',
    ICON: 'admin_panel_settings',
    PERMISSION_DESCRIPTION: 'Can manage all users and settings.'
  },
  MANAGER: {
    VALUE: 'Manager',
    LABEL: 'Manager',
    DESCRIPTION: 'Manage users',
    ICON: 'supervisor_account',
    PERMISSION_DESCRIPTION: 'Can manage users and view reports.'
  },
  USER: {
    VALUE: 'User',
    LABEL: 'User',
    DESCRIPTION: 'Basic access',
    ICON: 'person',
    PERMISSION_DESCRIPTION: 'Standard user permissions.'
  }
} as const;

// ===== ROLE HIERARCHY CONFIGURATION =====
export const ROLE_HIERARCHY = {
  Admin: ['Admin', 'Manager', 'User'],
  Manager: ['Manager', 'User'],
  User: ['User']
} as const;

// ===== FORM BUTTON CONFIGURATION =====
export const FORM_BUTTON_CONFIG = {
  MIN_WIDTH: '120px',
  HEIGHT: '44px',
  SPINNER_DIAMETER: 20,
  LOADING_TEXTS: {
    CREATING: 'Creating...',
    UPDATING: 'Updating...'
  },
  ACTION_TEXTS: {
    CREATE: 'Create User',
    UPDATE: 'Update User',
    CANCEL: 'Cancel'
  },
  ICONS: {
    ADD: 'add',
    SAVE: 'save',
    PERSON_ADD: 'person_add',
    EDIT: 'edit'
  }
} as const;

// ===== AUTOCOMPLETE CONFIGURATION =====
export const AUTOCOMPLETE_VALUES = {
  EMAIL: 'email',
  FIRST_NAME: 'given-name',
  LAST_NAME: 'family-name'
} as const;

// ===== NAME VALIDATION PATTERN =====
export const NAME_VALIDATION_PATTERN = /^[a-zA-Z\s\-']+$/;
export const CONSECUTIVE_SPECIAL_CHARS_PATTERN = /[\s\-']{2,}/;

// ===== DIALOG RESPONSE DELAY =====
export const DIALOG_RESPONSE_DELAY = 1500;

// ===== USER MESSAGES =====
export const USER_MESSAGES = {
  LOADING: 'Loading users...',
  LOAD_ERROR: 'Failed to load users',
  CREATE_SUCCESS: 'created successfully',
  UPDATE_SUCCESS: 'updated successfully',
  DELETE_SUCCESS: 'has been deleted successfully',
  STATUS_ACTIVATED: 'activated successfully',
  STATUS_DEACTIVATED: 'deactivated successfully',
  STATUS_UPDATE_ERROR: 'Failed to update user status',
  CREATE_ERROR: 'Failed to create user. Please try again.',
  UPDATE_ERROR: 'Failed to update user. Please try again.',
  DELETE_ERROR: 'Failed to delete user. Please try again.',
  EMAIL_EXISTS_ERROR: 'Email address is already registered',
  RETRY_ACTION: 'Retry',
  CLOSE_ACTION: 'Close'
}

// ===== EMPTY STATE MESSAGES =====
export const EMPTY_STATE_MESSAGES = {
  NO_USERS_FOUND: 'No users found',
  NO_ACTIVE_USERS: 'No active users available.',
  NO_USERS_AVAILABLE: 'No users available.',
  REFRESH_ACTION: 'Refresh'
}

// ===== CONFIRMATION DIALOG MESSAGES =====
export const CONFIRMATION_MESSAGES = {
  STATUS_CHANGE_TITLE: 'Confirm Status Change',
  DELETE_TITLE: 'Confirm Delete',
  ACTIVATE_ACTION: 'Activate',
  DEACTIVATE_ACTION: 'Deactivate',
  DELETE_ACTION: 'Delete Permanently',
  CANCEL_ACTION: 'Cancel'
}

// ===== MOCK USER DATA =====
export const MOCK_USERS = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', role: 'Admin', status: true },
  { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@example.com', role: 'User', status: true },
  { id: 3, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', role: 'Manager', status: false },
  { id: 4, firstName: 'Diana', lastName: 'Wilson', email: 'diana.wilson@example.com', role: 'User', status: true },
  { id: 5, firstName: 'Edward', lastName: 'Davis', email: 'edward.davis@example.com', role: 'Admin', status: false },
  { id: 6, firstName: 'Fiona', lastName: 'Miller', email: 'fiona.miller@example.com', role: 'User', status: true },
  { id: 7, firstName: 'George', lastName: 'Garcia', email: 'george.garcia@example.com', role: 'Manager', status: true },
  { id: 8, firstName: 'Helen', lastName: 'Martinez', email: 'helen.martinez@example.com', role: 'User', status: false },
  { id: 9, firstName: 'Ivan', lastName: 'Rodriguez', email: 'ivan.rodriguez@example.com', role: 'Admin', status: true },
  { id: 10, firstName: 'Julia', lastName: 'Lopez', email: 'julia.lopez@example.com', role: 'User', status: true },
  { id: 11, firstName: 'Kevin', lastName: 'Gonzalez', email: 'kevin.gonzalez@example.com', role: 'Manager', status: false },
  { id: 12, firstName: 'Laura', lastName: 'Hernandez', email: 'laura.hernandez@example.com', role: 'User', status: true }
]

// ===== SERVICE CONFIGURATION =====
export const USER_SERVICE_CONFIG = {
  MOCK_DELAY: {
    GET_USERS: 500,
    ADD_USER: 1000,
    UPDATE_USER: 1000,
    UPDATE_STATUS: 300,
    DELETE_USER: 300
  },
  DEFAULT_ROLE: 'Admin',
  ERROR_MESSAGES: {
    LOAD_USERS: 'Failed to load users',
    CREATE_USER: 'Failed to create user',
    UPDATE_USER: 'Failed to update user',
    USER_NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists'
  },
  SUCCESS_MESSAGES: {
    CREATE_USER: 'User created successfully',
    UPDATE_USER: 'User updated successfully'
  }
}

// ===== TYPE DEFINITIONS =====
export type UserTableColumn = typeof USER_TABLE_COLUMNS[number];

// ===== VALIDATION CONSTANTS =====
export const USER_VALIDATION = {
  MIN_ID: 1,
  EMAIL_CASE_COMPARISON: 'toLowerCase'
} as const;