import { tID } from './definitions';
import { NONCE_BITS, NODE_BITS } from './constants';

export function millsFromSwishflake(swishflake: string): number {
  const shiftedBig = BigInt(swishflake) >> BigInt(NONCE_BITS + NODE_BITS);
  console.log(shiftedBig);
  return parseInt(shiftedBig.toString(), 10); // This is safe since the number is at most EPOCH_BITS (42) bits long
}

export function toNamespaced(path: string, namespacePrefix: string): string {
  // Detect an expected preexsting prefix
  if (path.startsWith(namespacePrefix)) {
    // tslint:disable-next-line:no-console
    console.warn(
      `WARNING: Tried to namespace an already namespaced path ${path}`,
    );
    return path;
  }
  // Detect an *unexpected* prefix.  We're operating on the wrong database
  else if (path.startsWith('dev') || path.startsWith('prod')) {
    // tslint:disable-next-line:no-console
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
    // tslint:disable-next-line:no-console
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
    // tslint:disable-next-line:no-console
    console.warn(
      `WARNING: Detected a path namespaced with an *out of scope* prefix: ${path}, prefix will not be removed`,
    );
  }
  // Remove namespace
  return path.replace(namespacePrefix, '');
}
