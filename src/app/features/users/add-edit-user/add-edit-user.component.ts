import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { AddEditUserDialogData, RoleOption, FormFieldConfig, UserRole, AddEditUserFormData } from './add-edit-user.model';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import {
  ADD_EDIT_FORM_VALIDATION,
  ADD_EDIT_DIALOG_TITLES,
  ADD_EDIT_USER_MODES,
  ADD_EDIT_ROLE_LABELS,
  ADD_EDIT_ROLE_DESCRIPTIONS,
  ADD_EDIT_ROLE_PERMISSIONS,
  ADD_EDIT_ROLE_ICONS,
  ADD_EDIT_AUTOCOMPLETE,
  ADD_EDIT_DIALOG_RESPONSE,
  ADD_EDIT_ICON_SUFFIX,
  ADD_EDIT_ALL_ROLES_TEMPLATE
} from '../user.constant';

@Component({
  selector: 'app-add-edit-user',
  imports: [SharedModule],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class AddEditUserComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<AddEditUserComponent>);
  private data = inject(MAT_DIALOG_DATA) as AddEditUserDialogData;

  userForm!: FormGroup;
  isAddMode = this.data.mode === ADD_EDIT_USER_MODES.ADD;
  dialogTitle = this.isAddMode ? ADD_EDIT_DIALOG_TITLES.ADD_USER : ADD_EDIT_DIALOG_TITLES.EDIT_USER;

  availableRoles: RoleOption[] = [];
  private destroy$ = new Subject<void>();

  fieldConfigs: Record<string, FormFieldConfig> = {
    email: { label: 'Email Address', placeholder: 'Enter email address', maxLength: ADD_EDIT_FORM_VALIDATION.EMAIL_MAX_LENGTH, required: true, type: 'email' },
    firstName: { label: 'First Name', placeholder: 'Enter first name', maxLength: ADD_EDIT_FORM_VALIDATION.NAME_MAX_LENGTH, required: true, type: 'text' },
    lastName: { label: 'Last Name', placeholder: 'Enter last name', maxLength: ADD_EDIT_FORM_VALIDATION.NAME_MAX_LENGTH, required: true, type: 'text' },
    role: { label: 'User Role', placeholder: 'Select a role', required: true, type: 'select' }
  };

  private roleHierarchy: Record<UserRole, UserRole[]> = {
    [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER],
    [UserRole.MANAGER]: [UserRole.MANAGER, UserRole.USER],
    [UserRole.USER]: [UserRole.USER]
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

  private initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(ADD_EDIT_FORM_VALIDATION.EMAIL_MAX_LENGTH)]],
      firstName: ['', [Validators.required, Validators.minLength(ADD_EDIT_FORM_VALIDATION.NAME_MIN_LENGTH), Validators.maxLength(ADD_EDIT_FORM_VALIDATION.NAME_MAX_LENGTH), this.nameValidator]],
      lastName: ['', [Validators.required, Validators.minLength(ADD_EDIT_FORM_VALIDATION.NAME_MIN_LENGTH), Validators.maxLength(ADD_EDIT_FORM_VALIDATION.NAME_MAX_LENGTH), this.nameValidator]],
      role: ['', Validators.required],
    });
  }

  private setupAvailableRoles(): void {
    const currentRole = this.data.currentUserRole;
    const allowed = this.roleHierarchy[currentRole] || [UserRole.USER];

    const allRoles: RoleOption[] = ADD_EDIT_ALL_ROLES_TEMPLATE.map(roleTemplate => ({
      value: roleTemplate.value as UserRole,
      label: ADD_EDIT_ROLE_LABELS[roleTemplate.label as keyof typeof ADD_EDIT_ROLE_LABELS],
      description: ADD_EDIT_ROLE_DESCRIPTIONS[roleTemplate.description as keyof typeof ADD_EDIT_ROLE_DESCRIPTIONS],
      disabled: !allowed.includes(roleTemplate.value as UserRole)
    }));

    this.availableRoles = allRoles.filter(role => allowed.includes(role.value));
  }

  private setupLiveValidation(): void {
    this.userForm.get('email')?.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(ADD_EDIT_FORM_VALIDATION.EMAIL_CHECK_DEBOUNCE_MS), distinctUntilChanged())
      .subscribe(email => {
        if (email && this.userForm.get('email')?.valid) this.checkEmailUniqueness(email);
      });
  }

  private checkEmailUniqueness(email: string): void {
    if (!this.isAddMode && this.data.user?.email === email) return;

    this.userService.getUsers(false).subscribe({
      next: res => {
        const exists = res.users.some(user =>
          user.email.toLowerCase() === email.toLowerCase() &&
          (!this.data.user || user.id !== this.data.user.id)
        );
        const control = this.userForm.get('email');
        if (control) {
          if (exists) {
            control.setErrors({ ...control.errors, emailExists: true });
          } else if (control.hasError('emailExists')) {
            const { emailExists, ...other } = control.errors || {};
            control.setErrors(Object.keys(other).length ? other : null);
          }
        }
      }
    });
  }

  private populateForm(user: User): void {
    this.userForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  }

  private nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    const pattern = /^[a-zA-Z\s\-']+$/;
    if (!pattern.test(value) || /[\s\-']{2,}/.test(value) || value.trim().length === 0) {
      return { pattern: true };
    }
    return null;
  }

  getAutocomplete(field: string): string {
    return ADD_EDIT_AUTOCOMPLETE[field as keyof typeof ADD_EDIT_AUTOCOMPLETE] || 'off';
  }

  getRoleIcon(role: UserRole): string {
    return ADD_EDIT_ROLE_ICONS[role];
  }

  getRoleIconClass(role: UserRole): string {
    return role.toLowerCase() + ADD_EDIT_ICON_SUFFIX;
  }

  getRoleDisplayName(role: UserRole): string {
    return this.availableRoles.find(r => r.value === role)?.label || role;
  }

  getRolePermissionDescription(role: UserRole): string {
    return ADD_EDIT_ROLE_PERMISSIONS[role] || ADD_EDIT_ROLE_PERMISSIONS.USER;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormTouched();
      return;
    }

    const form = this.prepareFormData();
    const result = this.buildUserPayload(form);
    this.dialogRef.close({ success: true, user: result, mode: this.data.mode });
  }

  private markFormTouched(): void {
    Object.values(this.userForm.controls).forEach(control => control.markAsTouched());
  }

  private prepareFormData(): AddEditUserFormData {
    const { email, firstName, lastName, role } = this.userForm.value;
    return {
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role
    };
  }

  private buildUserPayload(form: AddEditUserFormData): User {
    return {
      ...form,
      id: this.isAddMode ? Date.now() : this.data.user!.id,
      status: this.isAddMode ? true : this.data.user!.status
    };
  }

  onCancel(): void {
    this.dialogRef.close({ success: false, cancelled: true });
  }
}
