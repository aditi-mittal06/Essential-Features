/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UnsubscribeOnDestroyAdapterComponent } from 'src/app/core/unsubscribe-on-destroy.adapter';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

import { LogLevels } from '../enums/log-level.enum';
import { DataGetError } from '../models/log-error.model';

// I found this handy as it tied the message more tightly to the message severity
interface LogMessage {
  logMsg: string;
  logLevel: LogLevels;
}

// Errors thrown from within this module are logged directly to console.

@Injectable({
  providedIn: 'root',
})
export class LogService extends UnsubscribeOnDestroyAdapterComponent {
  constructor(private _config: EnvironmentService) {
    super();
  }

  // these getters/setters enable runtime change to default configuration
  public getServerLogging(): boolean {
    return this._config.logToServer;
  }
  public getConsoleLogging(): boolean {
    return this._config.logToConsole;
  }
  public setServerLogging(loggingOn: boolean): void {
    this._config.logToServer = loggingOn;
  }
  public setConsoleLogging(loggingOn: boolean): void {
    this._config.logToConsole = loggingOn;
  }

  /*
    ! TLDR; It gets logged to *enabled* sinks if global sink threshold is met.

    ! These should be the general go-to routines

    For calls in this section of routines...
    Parameters:
     msg: the message to be (perhaps) logged
     caller: the component/service/etc. that initiated this call
   */
  public debug(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Debug,
    };
    this._logToServerAndConsoleDefault(logItem);
  }

  public log(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Info,
    };
    // this._logToServerAndConsoleDefault(logItem);
  }

  public warn(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Warning,
    };
    this._logToServerAndConsoleDefault(logItem);
  }

  public error(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Fatal,
    };
    this._logToServerAndConsoleDefault(logItem);
  }
  /* end section */
  /* end section */

  /* This section contains versions that expect the caller to specify what threshold to apply to the message being
    passed in. The provided level will determine if the debug/log/warn/error statement actually gets posted or not.

    ! TLDR; It gets logged to *enabled* sinks if threshold is met. "T" suffix stands for "Threshold"

    -------------
    The usefulness of this set of routines is in doubt, however here is the
    imagined scenario where these routines might prove useful.

    Case Study:

    Suppose Component X has a private variable this._MyThreshold defined.

    Sprinkled throughout Component X, there are statements like...

    this.logService.debugT('my debug message', this, this._MyThreshold);
    this.logService.infoT('my info message', this, this._MyThreshold);
    this.logService.warnT('my warn message', this, this._MyThreshold);
    this.logService.errorT('my error message', this, this._MyThreshold);

    By changing the value of this._MyThreshold in Component X, we change ("global
    to Component X") what level of messages are passed to enabled sinks. Thus we
    can rapidly escalate or de-escalate logging reporting severity defaults for a
    particular component without affecting logging defaults elsewhere in the app.

    It remains to be seen if these routines will prove useful. That's the theory, anyway.
    -------------


    For calls in this section of routines...
    Parameters:
     msg: the message to be (perhaps) logged
     caller: the component/service/etc. that initiated this call
     logThreshold: the logging level against which the message is to be evaluated.
   */
  public debugT(msg: string, caller: object, logThreshold: LogLevels): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Debug,
    };
    this._logToServerAndConsoleThreshold(logItem, logThreshold);
  }

  public logT(msg: string, caller: object, logThreshold: LogLevels): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Info,
    };
    this._logToServerAndConsoleThreshold(logItem, logThreshold);
  }

  public warnT(msg: string, caller: object, logThreshold: LogLevels): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Warning,
    };
    this._logToServerAndConsoleThreshold(logItem, logThreshold);
  }

  public errorT(msg: string, caller: object, logThreshold: LogLevels): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Fatal,
    };
    this._logToServerAndConsoleThreshold(logItem, logThreshold);
  }
  /* end section */
  /* end section */

  /* This section contains versions that forces logging (at specified severity) to enabled sinks, without threshold limits.

    ! TLDR; It gets logged to *enabled* sinks. "E" suffix stands for "Enabled"

    For calls in this section of routines...
    Parameters:
     msg: the message to be (perhaps) logged
     caller: the component/service/etc. that initiated this call
   */
  public debugE(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Debug,
    };
    this._logToServerAndConsoleEnabled(logItem);
  }

  public logE(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Info,
    };
    this._logToServerAndConsoleEnabled(logItem);
  }

  public warnE(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Warning,
    };
    this._logToServerAndConsoleEnabled(logItem);
  }

  public errorE(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Fatal,
    };
    this._logToServerAndConsoleEnabled(logItem);
  }
  /* end section */
  /* end section */

  /*
    ! TLDR; Log is passed to all sinks, regardless of enabled state. "F" suffix stands for "Force"

    For calls in this section of routines...
    Parameters:
     msg: the message to be (perhaps) logged
     caller: the component/service/etc. that initiated this call
   */
  public debugF(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Debug,
    };
    this._logToServerAndConsoleForce(logItem);
  }

  public logF(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Info,
    };
    this._logToServerAndConsoleForce(logItem);
  }

  public warnF(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Warning,
    }; // this message is an error
    this._logToServerAndConsoleForce(logItem);
  }

  public errorF(msg: string, caller: object): void {
    const logItem: LogMessage = {
      logMsg: this.format(msg, caller),
      logLevel: LogLevels.Fatal,
    }; // this message is an error
    this._logToServerAndConsoleForce(logItem);
  }
  /* end section */
  /* end section */

  /*
    Purpose: log provided message to console in level appropriate to message type.

    Parameters:
     logItem: an object with a message and a stated message type of debug/log/warning/error etc.

    If we decide to push the message to console, we need to decide on format. We
    use a format appropriate the severity level of the LogMessage. E.g., we'll use
    console.debug() if the LogMessage is a debug message.
  */
  private _logToConsole(logItem: LogMessage): void {
    // We will log this to console. How? Is it a verbose/debug message?
    if (logItem.logLevel <= LogLevels.Debug) {
      // NOTE: console.debug() handles both LogLevels.Verbose and LogLevels.Debug
      // eslint-disable-next-line no-console
      console.debug(logItem.logMsg);
    } else {
      // Not verbose/debug... Is it an info message?
      if (logItem.logLevel <= LogLevels.Info) {
        console.log(logItem.logMsg); // functionally equivalent to console.info(), I gather
      } else {
        // None of those. Is it a warning?
        if (logItem.logLevel <= LogLevels.Warning) {
          console.warn(logItem.logMsg);
        } else {
          /*
                     We here handle errors such as LogLevels.Fatal, LogLevels.Error, and
                     (?) anything worse.
                    */
          console.error(logItem.logMsg);
        }
      }
    }
  }

  /*
    Purpose: log (definitely) provided message to remote server.

    Parameters:
     logItem: an object with a message and a stated message type of debug/log/warning/error etc.
    */
  private _logToServer(logItem: LogMessage): void {
    // we need to escape quotation marks before passing in string
    let escaped_msg = logItem.logMsg.replace(/\"/g, '%22'); // in the api, we un-escape " values back, after safe transit
    escaped_msg = escaped_msg.replace(/\\/g, '%2F'); // in the api, we un-escape \ values back, after safe transit
    // notice that we multiple logLevel by 100 to get standard stackdriver logging levels, which are multiples of 100.
    let stackDriverLogLevel = logItem.logLevel * 100;
    if (stackDriverLogLevel < 100) {
      stackDriverLogLevel = 100;
    } // also, ensure minimum of 100, (100 = debug)
    const query = ` 
      {
        "operationName": "createLog",
        "variables": {
          "logCreate": {
            "jsonTags": "{\\"name\\": \\"${escaped_msg} wahoo\\"}",
            "severity": ${stackDriverLogLevel},
            "textPayload":  "${escaped_msg}"
          }
        },
        "query": "mutation createLog ($logCreate: logInput!) {
            payload: logCreate(log: $logCreate) {
              severity
          }
        }"
      }`;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // this.subs.sink = this.service.dataService
    //   .graphQLPost<IGraphQLData>(query)
    //   .pipe(
    //     map(q => {
    //       let xx = q.errors;
    //       if (!!xx) {
    //         let z = new HttpErrorResponse({
    //           error: xx,
    //           statusText: 'qraphql call to createLog() failed!',
    //           url: 'qraphql endpoint',
    //         });
    //         throw z;
    //       }
    //       let x = q.data.payload;
    //       if (!x) {
    //         console.error(`GraphQL returned no data! Throwing an error...`); // no point in calling on logService, LOL...
    //         throwError;
    //       }
    //       //return <Department>x[0]; // we're expecting just one item back
    //     }),
    //     //
    //     catchError((error: HttpErrorResponse) =>
    //       that._handleError(error, query)
    //     )
    //   )
    //   .subscribe();
  }

  /* WRAPPERS */
  /* WRAPPERS */

  // This is just a wrapper to shell out a log to (enabled)
  //  a) console, and/or
  //  b) remote server
  // using gobal threshold defaults provided for each sink as additional severity filter
  private _logToServerAndConsoleDefault(logItem: LogMessage): void {
    this._logToConsoleThreshold(logItem, this._config.logLevelConsole);
    this._logToServerThreshold(logItem, this._config.logLevelServer);
  }

  // This is just a wrapper to shell out a log to (enabled)
  //  a) console, and/or
  //  b) remote server
  // using provided thresholds as additional severity filter
  private _logToServerAndConsoleThreshold(
    logItem: LogMessage,
    logThreshold: LogLevels
  ): void {
    this._logToConsoleThreshold(logItem, logThreshold);
    this._logToServerThreshold(logItem, logThreshold);
  }

  // This is just a wrapper to shell out a log to (enabled)
  //  a) console, and/or
  //  b) remote server
  private _logToServerAndConsoleEnabled(logItem: LogMessage): void {
    this._logToConsoleEnabled(logItem);
    this._logToServerEnabled(logItem);
  }

  // This is just a wrapper to shell out a (definite!) log to
  //  a) console, *AND*
  //  b) remote server
  // notice that there is no evaluation of level or enabled sinks. Logging is simply *DONE*.
  private _logToServerAndConsoleForce(logItem: LogMessage): void {
    this._logToConsole(logItem);
    this._logToServer(logItem);
  }

  /*
    Purpose: log provided message to (enabled) console sink if the threshold is met

     This wrapper determines whether or not to proceed.

    Parameters:
     logItem: an object with a message
     logThreshold: the level against which the message is to be evaluated.

  */
  private _logToConsoleThreshold(
    logItem: LogMessage,
    logThreshold: LogLevels
  ): void {
    if (this._logRequestMeetsThreshold(logThreshold, logItem.logLevel)) {
      this._logToConsoleEnabled(logItem);
    }
  }

  /*
    Purpose: log provided message to console sink if it is enabled

     This wrapper determines whether or not to proceed.

    Parameters:
     logItem: an object with a message
  */
  private _logToConsoleEnabled(logItem: LogMessage): void {
    if (this._config.logToConsole) {
      this._logToConsole(logItem);
    }
  }

  /*
    Purpose: log provided message to (enabled) remote server sink if the threshold is met

     This wrapper determines whether or not to proceed.

    Parameters:
     logItem: an object with a message and a stated message type of debug/log/warning/error etc.
     logThreshold: the level against which the message is to be evaluated.
    */
  private _logToServerThreshold(
    logItem: LogMessage,
    logThreshold: number
  ): void {
    if (this._logRequestMeetsThreshold(logThreshold, logItem.logLevel)) {
      this._logToServerEnabled(logItem);
    }
  }

  /*
    Purpose: log provided message to remote server sink if it is enabled

     This wrapper determines whether or not to proceed.

    Parameters:
     logItem: an object with a message and a stated message type of debug/log/warning/error etc.
    */
  private _logToServerEnabled(logItem: LogMessage): void {
    if (this._config.logToServer) {
      this._logToServer(logItem);
    }
  }

  /*
    Returns: whether or not the logItemLevel meets the required threshold for
    actually getting logged.

    Parameters:
      thresholdLevel: the level against which the message is to be evaluated.
      logItemLevel: an object with a message and a stated message type of
         debug/log/warning/error etc.

    Logic:
    If logItemLevel is numerical at or below thresholdLevel, we log.
    Otherwise, we should eat the message silently.

    Examples:

    Suppose thresholdLevel comes in at Verbose (0).
      Evaluate (0 <= logItemLevel)
      This will always evaluate to true, so we log verbosely, as requested.

    Suppose thresholdLevel comes in at Fatal (5).
      Evaluate (5 <= logItemLevel)
      This is true only for errors or worse, so only those messages get logged.
      (Debug/info/warning messages are silently eaten, however.)
    */
  private _logRequestMeetsThreshold(
    thresholdLevel: LogLevels,
    logItemLevel: LogLevels
  ): boolean {
    return thresholdLevel <= logItemLevel;
  }

  private _handleError(
    error: HttpErrorResponse,
    query: string
  ): Observable<DataGetError> {
    console.error('This query failed: ' + query); // just spit it out right now
    const dataError = new DataGetError();
    dataError.errorNo = 500;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    dataError.message = error.error;
    dataError.friendlyMessage = 'An error occured while retrieving data.';
    return throwError(dataError);
  }

  private format(msg: string, caller: object) {
    // TODO - append username to message
    return (
      msg +
      ' (' +
      caller.constructor.name +
      ')' +
      ' [' +
      new Date().toISOString() +
      ']'
    );
  }
}
