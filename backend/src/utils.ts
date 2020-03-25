import { tID } from './definitions';

export function toNamespaced(path: string, namespacePrefix: string): string {
    // Detect an expected preexsting prefix
    if (path.startsWith(namespacePrefix)) {
        console.warn(
            `WARNING: Tried to namespace an already namespaced path ${path}`,
        );
        return path;
    }
    // Detect an *unexpected* prefix.  We're operating on the wrong database
    else if (path.startsWith('dev') || path.startsWith('prod')) {
        console.warn(
            `WARNING: Tried to namespace a path already namespaced with an *out of scope* prefix: ${path}`,
        );
        return path;
    }
    // Attach the namespace prefix
    return `${namespacePrefix}${path}`;
}

export function toGlobal(path: string, namespacePrefix: string): tID {
    // Detect a missing prefix
    if (!path.startsWith(namespacePrefix)) {
        console.warn(
            `WARNING: Tried to remove namespace from a path without a namespace ${path}`,
        );
        return path;
    }
    // Detect an unexpected preexisting prefix
    if (
        !path.startsWith(namespacePrefix) &&
        (path.startsWith('dev') || path.startsWith('prod'))
    ) {
        console.warn(
            `WARNING: Detected a path namespaced with an *out of scope* prefix: ${path}, prefix will not be removed`,
        );
    }
    // Remove namespace
    return path.replace(namespacePrefix, '');
}
