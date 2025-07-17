import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User, UserResponse } from './user.model';
import {
  AddEditUserData,
  AddEditUserResponse,
} from './add-edit-user/add-edit-user.model';
import {
  MOCK_USERS,
  USER_SERVICE_CONFIG,
  USER_VALIDATION,
} from './user.constant';
import { DISPLAY_MESSAGE } from 'src/app/shared/display-messages/display-messages';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private MOCK_USERS: User[] = [...MOCK_USERS];

  //Todo : We will update the code later with real API's.
  getUsers(showActiveOnly: boolean = true): Observable<UserResponse> {
    const users = showActiveOnly
      ? this.MOCK_USERS.filter((user) => user.status)
      : this.MOCK_USERS;

    return of({
      users,
      total: users.length,
    });
  }

  getCurrentUserRole(): string {
    return USER_SERVICE_CONFIG.DEFAULT_ROLE;
  }

  addUser(userData: AddEditUserData): Observable<AddEditUserResponse> {
    const emailExists = this.MOCK_USERS.some(
      (user) =>
        user.email[USER_VALIDATION.EMAIL_CASE_COMPARISON]() ===
        userData.email[USER_VALIDATION.EMAIL_CASE_COMPARISON]()
    );

    if (emailExists) {
      return throwError(() => DISPLAY_MESSAGE.EMAIL_EXISTS);
    }

    const newUser: User = {
      id:
        Math.max(...this.MOCK_USERS.map((u) => u.id)) + USER_VALIDATION.MIN_ID,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      status: userData.status ?? true,
    };

    this.MOCK_USERS.push(newUser);

    return of({
      success: true,
      user: newUser,
      message: DISPLAY_MESSAGE.CREATE_USER,
    });
  }

  updateUser(
    userId: number,
    userData: AddEditUserData
  ): Observable<AddEditUserResponse> {
    const userIndex = this.MOCK_USERS.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return throwError(
        () => USER_SERVICE_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND
      );
    }

    const emailExists = this.MOCK_USERS.some(
      (user) =>
        user.email[USER_VALIDATION.EMAIL_CASE_COMPARISON]() ===
          userData.email[USER_VALIDATION.EMAIL_CASE_COMPARISON]() &&
        user.id !== userId
    );

    if (emailExists) {
      return throwError(() => DISPLAY_MESSAGE.EMAIL_EXISTS);
    }

    const updatedUser: User = {
      ...this.MOCK_USERS[userIndex],
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    };

    this.MOCK_USERS[userIndex] = updatedUser;

    return of({
      success: true,
      user: updatedUser,
      message: DISPLAY_MESSAGE.UPDATE_USER,
    });
  }

  updateUserStatus(userId: number, status: boolean): Observable<boolean> {
    const userIndex = this.MOCK_USERS.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return throwError(
        () => USER_SERVICE_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND
      );
    }

    this.MOCK_USERS[userIndex].status = status;
    return of(true);
  }

  deleteUser(userId: number): Observable<boolean> {
    const userIndex = this.MOCK_USERS.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return throwError(
        () => USER_SERVICE_CONFIG.ERROR_MESSAGES.USER_NOT_FOUND
      );
    }

    this.MOCK_USERS.splice(userIndex, 1);
    return of(true);
  }
}
