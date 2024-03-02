import * as fs from 'fs';

export default class Logger {
    static writeLogToFile(logMessage: string, filePath: string): void {
        const timestampedLog: string = `[${new Date().toISOString()}] ${logMessage}\n`;

        fs.appendFile(filePath, timestampedLog, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            } else {
                console.log('Log written to file successfully.');
            }
        });
    }
}