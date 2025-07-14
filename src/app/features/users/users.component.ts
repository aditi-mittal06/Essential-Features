import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from './user.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { User } from './user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  UserTableColumn,
  USER_TABLE_COLUMNS,
  USER_MESSAGES,
  USER,
  USER_DIALOG_CONFIG,
} from './user.constant';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { UnsubscribeOnDestroyAdapterComponent } from 'src/app/core/unsubscribe-on-destroy.adapter';
import { COMMON_CONST } from 'src/app/shared/constants/common.constant';
import { DISPLAY_MESSAGE } from 'src/app/shared/display-messages/display-messages';
import { UserRole } from 'src/app/shared/enums/enum';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-users',
  imports: [SharedModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent
  extends UnsubscribeOnDestroyAdapterComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: UserTableColumn[] = [...USER_TABLE_COLUMNS];
  dataSource = new MatTableDataSource<User>();
  isLoading = false;
  showActiveOnly = true;
  error: string | null = null;
  currentUserRole: UserRole = UserRole.ADMIN;
  COMMON = COMMON_CONST;
  readonly messages = USER_MESSAGES;
  readonly DISPLAY_MESSAGE = DISPLAY_MESSAGE;
  showFirstLastButtons = USER.SHOW_FIRST_LAST_BUTTONS;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    @Inject(NotificationService)
    public notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCurrentUserRole();
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.gridSorting();
  }

  private getCurrentUserRole(): void {
    this.currentUserRole = this.userService.getCurrentUserRole() as UserRole;
  }

  gridSorting(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.subs.sink = this.userService.getUsers(this.showActiveOnly).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<User>(response.users);
        this.isLoading = false;
        this.gridSorting();
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
        this.notificationService.showError(USER_MESSAGES.LOAD_ERROR);
      },
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
      data: { mode: 'add', currentUserRole: this.currentUserRole },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success && result?.user) {
        this.notificationService.showSuccess(DISPLAY_MESSAGE.CREATE_USER);
        this.loadUsers();
      }
    });
  }

  onEditUser(user: User): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: USER_DIALOG_CONFIG.WIDTH,
      maxWidth: USER_DIALOG_CONFIG.MAX_WIDTH,
      disableClose: USER_DIALOG_CONFIG.DISABLE_CLOSE,
      data: { mode: 'edit', user, currentUserRole: this.currentUserRole },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success && result?.user) {
        this.notificationService.showSuccess(DISPLAY_MESSAGE.UPDATE_USER);
        this.loadUsers();
      }
    });
  }

  onStatusToggle(user: User, event: MatSlideToggleChange): void {
    event.source.checked = user.status;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to ${
          user.status ? 'deactivate' : 'activate'
        } ${user.firstName} ${user.lastName}?`,
      },
      width: COMMON_CONST.USER_DIALOG_CONFIG.CONFIRM_DIALOG_WIDTH,
      disableClose: COMMON_CONST.USER_DIALOG_CONFIG.DISABLE_CLOSE,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newStatus = !user.status;
        this.subs.sink = this.userService
          .updateUserStatus(user.id, newStatus)
          .subscribe({
            next: () => {
              user.status = newStatus;
              const showMessage = newStatus
                ? USER_MESSAGES.STATUS_ACTIVATED
                : USER_MESSAGES.STATUS_DEACTIVATED;
              this.notificationService.showSuccess(`User ${showMessage}`);
              if (this.showActiveOnly && !newStatus) this.loadUsers();
            },
            error: () => {
              this.notificationService.showError(
                USER_MESSAGES.STATUS_UPDATE_ERROR
              );
            },
          });
      }
    });
  }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        recordName: user.firstName,
      },
      width: COMMON_CONST.USER_DIALOG_CONFIG.CONFIRM_DIALOG_WIDTH,
      disableClose: COMMON_CONST.USER_DIALOG_CONFIG.DISABLE_CLOSE,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subs.sink = this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.notificationService.showSuccess(
              `${user.firstName} ${user.lastName} ${USER_MESSAGES.DELETE_SUCCESS}`
            );
            this.loadUsers();
          },
          error: () => {
            this.notificationService.showError(USER_MESSAGES.DELETE_ERROR);
          },
        });
      }
    });
  }
}
