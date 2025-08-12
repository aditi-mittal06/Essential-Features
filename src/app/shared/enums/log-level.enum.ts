export enum LOG_LEVELS {
  VERBOSE = 0, // ASP.NET Core Trace / Serilog Verbose
  DEBUG = 1, // ASP.NET Core Debug / Serilog Debug
  INFO = 2, // ASP.NET Core Info / Serilog Info
  WARNING = 3, // ASP.NET Core Info / Serilog Warning
  ERROR = 4, // ASP.NET Core Error / Serilog Error
  FATAL = 5, // ASP.NET Core Critical / Serilog Fatal
}
