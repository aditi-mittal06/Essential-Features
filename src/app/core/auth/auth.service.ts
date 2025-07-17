import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UnsubscribeOnDestroyAdapterComponent } from '../unsubscribe-on-destroy.adapter';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FirebaseError } from 'firebase/app';
import { COMMON } from 'src/app/shared/models/common.model';
import { Apollo } from 'apollo-angular';
import { GraphQLUser } from 'src/app/shared/api/graphql-user';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/constants/routes.constant';
import { CommonService } from 'src/app/shared/services/common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends UnsubscribeOnDestroyAdapterComponent {
  // BehaviorSubject to hold access token
  accessToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    @Inject(AngularFireAuth) private afAuth: AngularFireAuth,
    @Inject(Apollo) private _apollo: Apollo,
    @Inject(NotificationService)
    public notificationService: NotificationService,
    @Inject(Router) private _router: Router,
    @Inject(CommonService) private _commonService: CommonService
  ) {
    super();
  }

  // Method to sign in user
  signIn(email: string, password: string): Promise<void> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        // Get the Firebase token after successful sign-in
        const token = await userCredential.user?.getIdToken();
        if (token) {
          this.isLoginSuccess(token).subscribe({
            next: (response: COMMON.LoginResponse) => {
              if (response.login.success) {
                this._router.navigate([APP_ROUTES.USERS]);
                this.isLogin.next(true);
              }
            },
            error: (error) => {
              this.notificationService.showError(error);
            },
          });
        }
      })
      .catch((error: FirebaseError) => {
        // Handle sign-in errors
        this.notificationService.showError(error.code);
      });
  }

  isLoginSuccess(idToken: string): Observable<COMMON.LoginResponse> {
    return this._apollo
      .mutate({
        mutation: GraphQLUser.login,
        variables: {
          idToken,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          if (errors) {
            this._commonService.handleErrors(errors);
          }
          const responseData = data as COMMON.LoginResponse; // Type assertion
          const error = responseData.login.errors;
          if (error) {
            this._commonService.handleErrors(error);
          }
          return responseData;
        })
      );
  }
}
