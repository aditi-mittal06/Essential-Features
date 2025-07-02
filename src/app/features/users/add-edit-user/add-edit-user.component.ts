import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { AddEditUserDialogData, RoleOption, FormFieldConfig, UserRole, AddEditUserFormData } from './add-edit-user.model';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ADD_EDIT_FORM_VALIDATION, ADD_EDIT_DIALOG_RESPONSE_DELAY_MS } from '../user.constant';

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
  isLoading = false;
  isAddMode = this.data.mode === 'add';
  dialogTitle = this.isAddMode ? 'Add New User' : 'Edit User';
  availableRoles: RoleOption[] = [];
  private destroy$ = new Subject<void>();

  fieldConfigs: Record<string, FormFieldConfig> = {
    email: { label: 'Email Address', placeholder: 'Enter email address', maxLength: ADD_EDIT_FORM_VALIDATION.EMAIL_MAX_LENGTH, required: true, type: 'email' },
    firstName: { label: 'First Name', placeholder: 'Enter first name', maxLength: ADD_EDIT_FORM_VALIDATION.NAME_MAX_LENGTH, required: true, type: 'text' },
    lastName: { label: 'Last Name', placeholder: 'Enter last name', maxLength: ADD_EDIT_FORM_VALIDATION.NAME_MAX_LENGTH, required: true, type: 'text' },
    role: { label: 'User Role', placeholder: 'Select a role', required: true, type: 'select' },
  };

  private roleHierarchy: Record<UserRole, UserRole[]> = {
    [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER],
    [UserRole.MANAGER]: [UserRole.MANAGER, UserRole.USER],
    [UserRole.USER]: [UserRole.USER],
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
    const allowedRoles = this.roleHierarchy[currentRole] || [UserRole.USER];
    const allRoles: RoleOption[] = [
      { value: UserRole.ADMIN, label: 'Administrator', description: 'Full system access', disabled: !allowedRoles.includes(UserRole.ADMIN) },
      { value: UserRole.MANAGER, label: 'Manager', description: 'Manage users', disabled: !allowedRoles.includes(UserRole.MANAGER) },
      { value: UserRole.USER, label: 'User', description: 'Basic access', disabled: !allowedRoles.includes(UserRole.USER) },
    ];
    this.availableRoles = allRoles.filter(role => allowedRoles.includes(role.value));
  }

  private setupLiveValidation(): void {
    this.userForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(ADD_EDIT_FORM_VALIDATION.DEBOUNCE_TIME_MS), distinctUntilChanged())
      .subscribe(() => {
        Object.keys(this.userForm.controls).forEach(field => this.userForm.get(field)?.markAsTouched());
      });

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
        const exists = res.users.some(user => user.email.toLowerCase() === email.toLowerCase() && (!this.data.user || user.id !== this.data.user.id));
        const control = this.userForm.get('email');
        if (control) {
          if (exists) {
            control.setErrors({ ...control.errors, emailExists: true });
          } else if (control.hasError('emailExists')) {
            const { emailExists, ...otherErrors } = control.errors || {};
            control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
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
      role: user.role,
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
    return field === 'email' ? 'email' : field === 'firstName' ? 'given-name' : 'family-name';
  }

  getRoleIcon(role: UserRole): string {
    return role === UserRole.ADMIN ? 'admin_panel_settings' : role === UserRole.MANAGER ? 'supervisor_account' : 'person';
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
        return 'Can manage all users and settings.';
      case UserRole.MANAGER:
        return 'Can manage users and view reports.';
      case UserRole.USER:
      default:
        return 'Standard user permissions.';
    }
  }

  onSubmit(): void {
    if (!this.userForm.valid || this.isLoading) {
      this.markFormTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    setTimeout(() => {
      const result = this.buildUserPayload(formData);
      this.dialogRef.close({ success: true, user: result, mode: this.data.mode });
      this.isLoading = false;
    }, ADD_EDIT_DIALOG_RESPONSE_DELAY_MS);
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
