import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { UserService } from './user.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { User, UserRole } from './user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  UserTableColumn,
  USER_TABLE_COLUMNS,
  USER_MESSAGES,
  EMPTY_STATE_MESSAGES,
  USER_DIALOG_CONFIG,
  CONFIRMATION_MESSAGES,
  SNACKBAR_CONFIG
} from './user.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [SharedModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: UserTableColumn[] = [...USER_TABLE_COLUMNS];
  dataSource = new MatTableDataSource<User>();
  isLoading = false;
  showActiveOnly = true;
  error: string | null = null;
  currentUserRole: UserRole = UserRole.ADMIN;

  readonly messages = USER_MESSAGES;
  readonly EMPTY_STATE_MESSAGES = EMPTY_STATE_MESSAGES;
  showFirstLastButtons = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCurrentUserRole();
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getCurrentUserRole(): void {
    this.currentUserRole = this.userService.getCurrentUserRole() as UserRole;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.userService.getUsers(this.showActiveOnly).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<User>(response.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
        this.snackBar.open(USER_MESSAGES.LOAD_ERROR, USER_MESSAGES.CLOSE_ACTION, {
          duration: SNACKBAR_CONFIG.DURATION,
          panelClass: [SNACKBAR_CONFIG.ERROR_CLASS]
        });
      }
    });
  }

  onFilterToggle(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.loadUsers();
  }


  onAddUser(): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: USER_DIALOG_CONFIG.WIDTH,
      maxWidth: USER_DIALOG_CONFIG.MAX_WIDTH,
      disableClose: USER_DIALOG_CONFIG.DISABLE_CLOSE,
      data: { mode: 'add', currentUserRole: this.currentUserRole }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success && result?.user) {
        this.snackBar.open(
          `${result.user.firstName} ${result.user.lastName} ${USER_MESSAGES.CREATE_SUCCESS}`,
          USER_MESSAGES.CLOSE_ACTION,
          {
            duration: SNACKBAR_CONFIG.SUCCESS_DURATION,
            panelClass: [SNACKBAR_CONFIG.SUCCESS_CLASS]
          }
        );
        this.loadUsers();
      }
    });
  }

  onEditUser(user: User): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: USER_DIALOG_CONFIG.WIDTH,
      maxWidth: USER_DIALOG_CONFIG.MAX_WIDTH,
      disableClose: USER_DIALOG_CONFIG.DISABLE_CLOSE,
      data: { mode: 'edit', user, currentUserRole: this.currentUserRole }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success && result?.user) {
        this.snackBar.open(
          `${result.user.firstName} ${result.user.lastName} ${USER_MESSAGES.UPDATE_SUCCESS}`,
          USER_MESSAGES.CLOSE_ACTION,
          {
            duration: SNACKBAR_CONFIG.SUCCESS_DURATION,
            panelClass: [SNACKBAR_CONFIG.SUCCESS_CLASS]
          }
        );
        this.loadUsers();
      }
    });
  }

  onStatusToggle(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: USER_DIALOG_CONFIG.CONFIRM_DIALOG_WIDTH,
      disableClose: USER_DIALOG_CONFIG.DISABLE_CLOSE,
      data: {
        title: CONFIRMATION_MESSAGES.STATUS_CHANGE_TITLE,
        message: `Are you sure you want to ${user.status ? 'deactivate' : 'activate'} ${user.firstName} ${user.lastName}?`,
        confirmText: user.status ? CONFIRMATION_MESSAGES.DEACTIVATE_ACTION : CONFIRMATION_MESSAGES.ACTIVATE_ACTION,
        cancelText: CONFIRMATION_MESSAGES.CANCEL_ACTION
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newStatus = !user.status;
        this.userService.updateUserStatus(user.id, newStatus).subscribe({
          next: () => {
            user.status = newStatus;
            this.snackBar.open(
              `User ${newStatus ? USER_MESSAGES.STATUS_ACTIVATED : USER_MESSAGES.STATUS_DEACTIVATED}`,
              USER_MESSAGES.CLOSE_ACTION,
              {
                duration: SNACKBAR_CONFIG.DURATION,
                panelClass: [SNACKBAR_CONFIG.SUCCESS_CLASS]
              }
            );
            if (this.showActiveOnly && !newStatus) this.loadUsers();
          },
          error: () => {
            this.snackBar.open(USER_MESSAGES.STATUS_UPDATE_ERROR, USER_MESSAGES.CLOSE_ACTION, {
              duration: SNACKBAR_CONFIG.DURATION,
              panelClass: [SNACKBAR_CONFIG.ERROR_CLASS]
            });
          }
        });
      }
    });
  }


  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: USER_DIALOG_CONFIG.DELETE_DIALOG_WIDTH,
      disableClose: USER_DIALOG_CONFIG.DISABLE_CLOSE,
      data: {
        title: CONFIRMATION_MESSAGES.DELETE_TITLE,
        message: `Are you sure you want to permanently delete ${user.firstName} ${user.lastName}?`,
        confirmText: CONFIRMATION_MESSAGES.DELETE_ACTION,
        cancelText: CONFIRMATION_MESSAGES.CANCEL_ACTION,
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open(
              `${user.firstName} ${user.lastName} ${USER_MESSAGES.DELETE_SUCCESS}`,
              USER_MESSAGES.CLOSE_ACTION,
              {
                duration: SNACKBAR_CONFIG.DURATION,
                panelClass: [SNACKBAR_CONFIG.SUCCESS_CLASS]
              }
            );
            this.loadUsers();
          },
          error: () => {
            this.snackBar.open(USER_MESSAGES.DELETE_ERROR, USER_MESSAGES.CLOSE_ACTION, {
              duration: SNACKBAR_CONFIG.DURATION,
              panelClass: [SNACKBAR_CONFIG.ERROR_CLASS]
            });
          }
        });
      }
    });
  }
}
