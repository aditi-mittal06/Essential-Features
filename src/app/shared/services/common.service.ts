import { Injectable } from '@angular/core';
import { COMMON } from '../models/common.model';
import { COMMON_CONST } from '../constants/common.constant';
import { GraphQLFormattedError } from 'graphql';
import { RESPONSE_MESSAGE } from '../display-messages/display-messages';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  handleErrors(
    errors: readonly GraphQLFormattedError[] | COMMON.RequestError[] | undefined
  ): void {
    if (errors && errors.length > COMMON_CONST.ZERO) {
      const errMsg =
        errors.length && errors[COMMON_CONST.ZERO].message
          ? errors[COMMON_CONST.ZERO].message
          : RESPONSE_MESSAGE.SOMETHING_WRONG;
      throw new Error(errMsg);
    }
  }
}
