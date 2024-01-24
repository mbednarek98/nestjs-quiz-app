import * as errorMessages from '../../static/error-messages.json';

export function getErrorMessage(
    key: string,
    replacements?: Record<string, string | number>,
): string {
    let message = errorMessages[key];

    if (replacements) {
        Object.keys(replacements).forEach(replaceKey => {
            message = message.replace(`{${replaceKey}}`, replacements[replaceKey].toString());
        });
    }

    return message;
}
