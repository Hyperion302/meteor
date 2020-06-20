import { IChannel } from '~/models/channel';
import {
  ServerError,
  InvalidInputError,
  AuthorizationError,
  ResourceNotFoundError,
  PlatformError,
} from '~/models/error';
import { $axios } from '~/services/api';

export async function deleteChannel(id: string): Promise<void> {
  const { status } = await $axios.delete(`https://api.swish.tv/channel/${id}`);
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('channel', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
}
export async function createChannel(name: string): Promise<IChannel> {
  const { status, data } = await $axios.post(`https://api.swish.tv/channel`, {
    name,
  });
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return {
    owner: data.owner,
    id: data.id,
    name: data.name,
  };
}
export async function uploadIcon(id: string, icon: File): Promise<void> {
  if (process.server) {
    throw new PlatformError();
  }
  const fd = new FormData();
  fd.append('icon', icon);

  const { status } = await $axios.post(
    `https://api.swish.tv/channel/${id}/uploadIcon`,
    fd,
  );
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('channel', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
}
export async function getChannel(id: string): Promise<IChannel> {
  const { data, status } = await $axios.get(
    `https://api.swish.tv/channel/${id}`,
  );
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('channel', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return {
    owner: data.owner,
    id: data.id,
    name: data.name,
  };
}
export async function queryChannels(owner: string): Promise<IChannel[]> {
  const { data, status } = await $axios.get('https://api.swish.tv/channel', {
    params: {
      owner,
    },
  });
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return data.map((channel: any) => {
    return {
      name: channel.name,
      owner: channel.owner,
      id: channel.id,
    };
  });
}
export async function updateChannel(
  id: string,
  name: string,
): Promise<IChannel> {
  const { data, status } = await $axios.put(
    `https://api.swish.tv/channel/${id}`,
    {
      name,
    },
  );
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('channel', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return {
    owner: data.owner,
    id: data.id,
    name: data.name,
  };
}
