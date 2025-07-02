import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { AddEditUserDialogData, RoleOption, FormFieldConfig, UserRole, AddEditUserFormData } from './add-edit-user.model';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import {
  ADD_EDIT_USER_DIALOG_CONFIG,
  ADD_EDIT_USER_TITLES,
  FORM_FIELD_CONFIGS,
  FORM_VALIDATION,
  ROLE_OPTIONS,
  ROLE_HIERARCHY,
  FORM_BUTTON_CONFIG,
  AUTOCOMPLETE_VALUES,
  NAME_VALIDATION_PATTERN,
  CONSECUTIVE_SPECIAL_CHARS_PATTERN,
  DIALOG_RESPONSE_DELAY
} from '../user.constant';

@Component({
  selector: 'app-add-edit-user',
  imports: [SharedModule],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<AddEditUserComponent>);
  private data = inject(MAT_DIALOG_DATA) as AddEditUserDialogData;

  userForm!: FormGroup;
  isLoading = false;
  isAddMode = this.data.mode === 'add';
  dialogTitle = this.isAddMode ? ADD_EDIT_USER_TITLES.ADD_MODE : ADD_EDIT_USER_TITLES.EDIT_MODE;

  availableRoles: RoleOption[] = [];
  private destroy$ = new Subject<void>();

  fieldConfigs: Record<string, FormFieldConfig> = {
    email: {
      label: FORM_FIELD_CONFIGS.EMAIL.LABEL,
      placeholder: FORM_FIELD_CONFIGS.EMAIL.PLACEHOLDER,
      maxLength: FORM_FIELD_CONFIGS.EMAIL.MAX_LENGTH,
      required: FORM_FIELD_CONFIGS.EMAIL.REQUIRED,
      type: FORM_FIELD_CONFIGS.EMAIL.TYPE
    },
    firstName: {
      label: FORM_FIELD_CONFIGS.FIRST_NAME.LABEL,
      placeholder: FORM_FIELD_CONFIGS.FIRST_NAME.PLACEHOLDER,
      maxLength: FORM_FIELD_CONFIGS.FIRST_NAME.MAX_LENGTH,
      required: FORM_FIELD_CONFIGS.FIRST_NAME.REQUIRED,
      type: FORM_FIELD_CONFIGS.FIRST_NAME.TYPE
    },
    lastName: {
      label: FORM_FIELD_CONFIGS.LAST_NAME.LABEL,
      placeholder: FORM_FIELD_CONFIGS.LAST_NAME.PLACEHOLDER,
      maxLength: FORM_FIELD_CONFIGS.LAST_NAME.MAX_LENGTH,
      required: FORM_FIELD_CONFIGS.LAST_NAME.REQUIRED,
      type: FORM_FIELD_CONFIGS.LAST_NAME.TYPE
    },
    role: {
      label: FORM_FIELD_CONFIGS.ROLE.LABEL,
      placeholder: FORM_FIELD_CONFIGS.ROLE.PLACEHOLDER,
      required: FORM_FIELD_CONFIGS.ROLE.REQUIRED,
      type: FORM_FIELD_CONFIGS.ROLE.TYPE
    }
  };

  private roleHierarchy: Record<UserRole, UserRole[]> = {
    [UserRole.ADMIN]: ROLE_HIERARCHY.Admin as UserRole[],
    [UserRole.MANAGER]: ROLE_HIERARCHY.Manager as UserRole[],
    [UserRole.USER]: ROLE_HIERARCHY.User as UserRole[]
  };

  ngOnInit(): void {
    this.initForm();
    this.setupAvailableRoles();
    this.setupLiveValidation();
    if (!this.isAddMode && this.data.user) this.populateForm(this.data.user);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(FORM_VALIDATION.MAX_EMAIL_LENGTH)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(FORM_VALIDATION.MIN_NAME_LENGTH),
        Validators.maxLength(FORM_VALIDATION.MAX_NAME_LENGTH),
        this.nameValidator
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(FORM_VALIDATION.MIN_NAME_LENGTH),
        Validators.maxLength(FORM_VALIDATION.MAX_NAME_LENGTH),
        this.nameValidator
      ]],
      role: ['', [Validators.required]]
    });
  }

  setupAvailableRoles(): void {
    const currentRole = this.data.currentUserRole;
    const allowed = this.roleHierarchy[currentRole] || [UserRole.USER];
    const allRoles: RoleOption[] = [
      {
        value: UserRole.ADMIN,
        label: ROLE_OPTIONS.ADMIN.LABEL,
        description: ROLE_OPTIONS.ADMIN.DESCRIPTION,
        disabled: !allowed.includes(UserRole.ADMIN)
      },
      {
        value: UserRole.MANAGER,
        label: ROLE_OPTIONS.MANAGER.LABEL,
        description: ROLE_OPTIONS.MANAGER.DESCRIPTION,
        disabled: !allowed.includes(UserRole.MANAGER)
      },
      {
        value: UserRole.USER,
        label: ROLE_OPTIONS.USER.LABEL,
        description: ROLE_OPTIONS.USER.DESCRIPTION,
        disabled: !allowed.includes(UserRole.USER)
      }
    ];
    this.availableRoles = allRoles.filter(role => allowed.includes(role.value));
  }

  setupLiveValidation(): void {
    this.userForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(FORM_VALIDATION.DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(() => {
      Object.keys(this.userForm.controls).forEach(field => this.userForm.get(field)?.markAsTouched());
    });

    this.userForm.get('email')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(FORM_VALIDATION.EMAIL_CHECK_DEBOUNCE),
      distinctUntilChanged()
    ).subscribe(email => {
      if (email && this.userForm.get('email')?.valid) this.checkEmailUniqueness(email);
    });
  }

  checkEmailUniqueness(email: string): void {
    if (!this.isAddMode && this.data.user?.email === email) return;
    this.userService.getUsers(false).subscribe({
      next: res => {
        const exists = res.users.some(user => user.email.toLowerCase() === email.toLowerCase() && (!this.data.user || user.id !== this.data.user.id));
        const control = this.userForm.get('email');
        if (control) {
          if (exists) control.setErrors({ ...control.errors, emailExists: true });
          else if (control.hasError('emailExists')) {
            const { emailExists, ...other } = control.errors || {};
            control.setErrors(Object.keys(other).length ? other : null);
          }
        }
      }
    });
  }

  populateForm(user: User): void {
    this.userForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  }

  nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    if (!NAME_VALIDATION_PATTERN.test(value) || 
        CONSECUTIVE_SPECIAL_CHARS_PATTERN.test(value) || 
        value.trim().length === 0) {
      return { pattern: true };
    }
    return null;
  }

  getAutocomplete(field: string): string {
    switch (field) {
      case 'email':
        return AUTOCOMPLETE_VALUES.EMAIL;
      case 'firstName':
        return AUTOCOMPLETE_VALUES.FIRST_NAME;
      case 'lastName':
        return AUTOCOMPLETE_VALUES.LAST_NAME;
      default:
        return '';
    }
  }

  getRoleIcon(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return ROLE_OPTIONS.ADMIN.ICON;
      case UserRole.MANAGER:
        return ROLE_OPTIONS.MANAGER.ICON;
      case UserRole.USER:
        return ROLE_OPTIONS.USER.ICON;
      default:
        return ROLE_OPTIONS.USER.ICON;
    }
  }

  getRoleIconClass(role: UserRole): string {
    return role.toLowerCase() + '-icon';
  }

  getRoleDisplayName(role: UserRole): string {
    return this.availableRoles.find(r => r.value === role)?.label || role;
  }

  getRolePermissionDescription(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return ROLE_OPTIONS.ADMIN.PERMISSION_DESCRIPTION;
      case UserRole.MANAGER:
        return ROLE_OPTIONS.MANAGER.PERMISSION_DESCRIPTION;
      case UserRole.USER:
        return ROLE_OPTIONS.USER.PERMISSION_DESCRIPTION;
      default:
        return ROLE_OPTIONS.USER.PERMISSION_DESCRIPTION;
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && !this.isLoading) {
      this.isLoading = true;
      const form: AddEditUserFormData = {
        email: this.userForm.value.email.trim(),
        firstName: this.userForm.value.firstName.trim(),
        lastName: this.userForm.value.lastName.trim(),
        role: this.userForm.value.role
      };
      setTimeout(() => {
        const result = {
          ...form,
          id: this.isAddMode ? Date.now() : this.data.user!.id,
          status: this.isAddMode ? true : this.data.user!.status
        };
        this.dialogRef.close({ success: true, user: result, mode: this.data.mode });
        this.isLoading = false;
      }, DIALOG_RESPONSE_DELAY);
    } else {
      Object.values(this.userForm.controls).forEach(control => control.markAsTouched());
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false, cancelled: true });
  }
}