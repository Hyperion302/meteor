import { tID } from './definitions';

export function toNamespaced(id: tID, namespacePrefix: string): string {
    // Detect an expected preexsting prefix
    if (id.startsWith(namespacePrefix)) {
        console.warn(
            `WARNING: Tried to namespace an already namespaced ID ${id}`,
        );
        return id;
    }
    // Detect an *unexpected* prefix.  We're operating on the wrong database
    else if (id.startsWith('dev') || id.startsWith('prod')) {
        console.warn(
            `WARNING: Tried to namespace an ID already namespaced with an *out of scope* ID ${id}`,
        );
        return id;
    }
    // Attach the namespace prefix
    return `${namespacePrefix}${id}`;
}

export function toGlobal(id: string, namespacePrefix: string): tID {
    // Detect a missing prefix
    if (!id.startsWith(namespacePrefix)) {
        console.warn(
            `WARNING: Tried to remove namespace from ID without namespace ${id}`,
        );
        return id;
    }
    // Detect an unexpected preexisting prefix
    if (
        !id.startsWith(namespacePrefix) &&
        (id.startsWith('dev') || id.startsWith('prod'))
    ) {
        console.warn(
            `WARNING: Detected an ID namespaced with an *out of scope* ID ${id}, prefix will not be removed`,
        );
    }
    // Remove namespace
    return id.replace(namespacePrefix, '');
}
