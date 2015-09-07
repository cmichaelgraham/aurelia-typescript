declare module 'aurelia-logging' {
  
  /**
  * Implemented by classes which wish to append log data to a target data store.
  */
  export interface Appender {
    debug(logger: Logger): void;
    info(logger: Logger): void;
    warn(logger: Logger): void;
    error(logger: Logger): void;
  }
  
  /**
  * Creates an instance of Error that aggregates and preserves an innerError.
  */
  export function AggregateError(message: string, innerError?: Error, skipIfAlreadyAggregate?: boolean): Error;
  
  /**
  * Enum specifying the levels of the logger
  */
  export const logLevel: any;
  
  /**
  * Gets an instance of a logger by the Id used when creating.
  *
  * @param id The id of the logger you wish to get an instance of.
  * @return The instance of the logger, or creates a new logger if none exists for that Id.
  */
  export function getLogger(id: string): Logger;
  
  /**
  * Adds an appender capable of processing logs and channeling them to an output.
  *
  * @param appender An appender instance to begin processing logs with.
  */
  export function addAppender(appender: Appender): void;
  
  /**
  * Sets the level of the logging for the application loggers
  *
  * @param level Matches an enum specifying the level of logging.
  */
  export function setLevel(level: number): void;
  
  /**
  * A logger logs messages to a set of appenders, depending on the log level that is set.
  */
  export class Logger {
    
    /**
      * You cannot instantiate the logger directly - you must use the getLogger method instead.
      */
    constructor(id: string, key: Object);
    
    /**
       * Logs a debug message.
       *
       * @param message The message to log.
       */
    debug(message: string): void;
    
    /**
       * Logs info.
       *
       * @param message The message to log.
       */
    info(message: string): void;
    
    /**
       * Logs a warning.
       *
       * @param message The message to log.
       */
    warn(message: string): void;
    
    /**
       * Logs an error.
       *
       * @param message The message to log.
       */
    error(message: string): void;
  }
}