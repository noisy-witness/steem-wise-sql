import * as winston from "winston";

export class Log {
    public static configureLoggers() {
        Log.getLogger().add(
            new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(info => {
                    return `${info.timestamp} [${info.level}]: ${info.message}`;
                })
            ),
            timestamp: true,
        } as object));
        Log.getLogger().level = "warn";
    }

    public static setLevel(level: string) {
        Log.getLogger().level = level;
    }

    public static getLogger(): winston.Logger {
        return (winston.loggers as any).get("steem-wise-sql");
    }

    public static cheapDebug(debugStringReturnerFn: () => string): void {
        const logger = Log.getLogger();
        if (logger.levels[logger.level] >= logger.levels["debug"]) logger.debug(debugStringReturnerFn());
    }

    public static cheapInfo(infoStringReturnerFn: () => string): void {
        const logger = Log.getLogger();
        if (logger.levels[logger.level] >= logger.levels["info"]) logger.debug(infoStringReturnerFn());
    }

    public static promiseResolveDebug<T>(msgBeginning: string, result: T): T {
        Log.cheapDebug(() => msgBeginning + JSON.stringify(result));
        return result;
    }

    public static promiseRejectionDebug<T>(msgBeginning: string, error: T): T {
        Log.cheapDebug(() => msgBeginning + JSON.stringify(error));
        throw error;
    }
}