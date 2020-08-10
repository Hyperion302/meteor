import { IVideo } from '~/models/video';

export function calcEVC(wt: number, video: IVideo): number {
  if (!video.content) {
    return 0;
  }
  return Math.round(wt / video.content.duration);
}

export function formatDate(seconds: number): string {
  const dateObj = new Date(seconds * 1000);
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const day = dateObj.toLocaleString('en-US', { day: 'numeric' });
  const year = dateObj.toLocaleString('en-US', { year: 'numeric' });
  return `${month} ${day}, ${year}`;
}

export function formatAge(seconds: number): string {
  return `${formatDuration(
    Math.floor((Date.now() - seconds * 1000) / 1000),
  )} ago`;
}

export function formatDuration(seconds: number, short?: boolean): string {
  // Less than a minute, seconds
  if (seconds < 60) {
    const pfix = short ? 's' : `second${seconds !== 1 ? 's' : ''}`;
    return `${seconds} ${pfix}`;
  }
  // Less than an hour, minutes
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const pfix = short ? 'm' : `minute${minutes !== 1 ? 's' : ''}`;
    return `${minutes} ${pfix}`;
  }
  // Less than a day, hours
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const pfix = short ? 'h' : `hour${hours !== 1 ? 's' : ''}`;
    return `${hours} ${pfix}`;
  }
  // Less than a week, days
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    const pfix = short ? 'd' : `day${days !== 1 ? 's' : ''}`;
    return `${days} ${pfix}`;
  }
  // Less than a month, weeks
  if (seconds < 2419200) {
    const weeks = Math.floor(seconds / 604800);
    const pfix = short ? 'w' : `week${weeks !== 1 ? 's' : ''}`;
    return `${weeks} ${pfix}`;
  }
  // Less than a year, months
  if (seconds < 125798400) {
    const months = Math.floor(seconds / 2419200);
    const pfix = short ? 'm' : `month${months !== 1 ? 's' : ''}`;
    return `${months} ${pfix}`;
  }
  // Years
  if (seconds >= 125798400) {
    const years = Math.floor(seconds / 125798400);
    const pfix = short ? 'y' : `year${years !== 1 ? 's' : ''}`;
    return `${years} ${pfix}`;
  }

  return '';
}

export function shortenCount(count: number): string {
  // Less than 1,000, no unit
  if (count < 1000) {
    return count.toString();
  }
  // Less than 10,000, K with 1 decimal place
  if (count < 10000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  // Less than 1,000,000, K with no decimal place
  if (count < 1000000) {
    return `${Math.round(count / 1000)}K`;
  }
  // Less than 10,000,000, M with 1 decimal place
  if (count < 10000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  // Less than 1,000,000,000, M with no decimal place
  if (count < 1000000000) {
    return `${Math.round(count / 1000000)}M`;
  }
  // Less than 10,000,000,000, B with 1 decimal place
  if (count < 10000000000) {
    return `${(count / 1000000000).toFixed(1)}B`;
  }
  // B with no decimal place
  return `${Math.round(count / 1000000000)}B`;
}

export function millsFromSwishflake(swishflake: string): number {
  // eslint-disable-next-line no-undef
  const shiftedBig = (BigInt(swishflake) >> BigInt(22)) + 1577836800000n; // tslint:disable-line:no-bitwise
  return parseInt(shiftedBig.toString(), 10); // This is safe since the number is at most EPOCH_BITS (42) bits long
}
