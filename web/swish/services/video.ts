import {
  ServerError,
  InvalidInputError,
  AuthorizationError,
  ResourceNotFoundError,
  PlatformError,
} from '~/models/error';
import { $axios } from '~/services/api';
import { IVideo, IVideoUpdate } from '~/models/video';

export async function uploadVideo(id: string, video: File): Promise<void> {
  if (process.server) {
    throw new PlatformError();
  }
  const fd = new FormData();
  fd.append('video', video);
  const { status } = await $axios.post(
    `https://api.swish.tv/video/${id}/upload`,
    fd,
  );
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      // FIXME: Should check if it's video or not channel found
      throw new ResourceNotFoundError('video', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
}
export async function createVideo(
  title: string,
  description: string,
  channel: string,
): Promise<IVideo> {
  const { data, status } = await $axios.post('https://api.swish.tv/video', {
    title,
    description,
    channel,
  });
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('channel', channel);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return {
    id: data.id,
    title: data.title,
    author: data.author,
    description: data.description,
    uploadDate: data.uploadDate,
    channel: {
      id: data.channel.id,
      name: data.channel.name,
      owner: data.channel.owner,
    },
    content: undefined,
  };
}
export async function getVideo(id: string): Promise<IVideo> {
  const { data, status } = await $axios.get(`https://api.swish.tv/video/${id}`);
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('video', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return {
    id: data.id,
    title: data.title,
    author: data.author,
    description: data.description,
    uploadDate: data.uploadDate,
    channel: {
      id: data.channel.id,
      name: data.channel.name,
      owner: data.channel.owner,
    },
    content: {
      id: data.content.id,
      playbackID: data.content.playbackID,
      assetID: data.content.assetID,
    },
  };
}
export async function queryVideos(channel: string): Promise<IVideo[]> {
  const { data, status } = await $axios.get('https://api.swish.tv/video', {
    params: {
      channel,
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
  return data.map((video: any) => {
    return {
      id: video.id,
      title: video.title,
      author: video.author,
      description: video.description,
      uploadDate: video.uploadDate,
      channel: {
        id: video.channel.id,
        name: video.channel.name,
        owner: video.channel.owner,
      },
      content: {
        id: video.content.id,
        playbackID: video.content.playbackID,
        assetID: video.content.assetID,
      },
    };
  });
}
export async function updateVideo(
  id: string,
  update: IVideoUpdate,
): Promise<IVideo> {
  const { data, status } = await $axios.put(
    `https://api.swish.tv/video/${id}`,
    update,
  );
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('video', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
  return {
    id: data.id,
    title: data.title,
    author: data.author,
    description: data.description,
    uploadDate: data.uploadDate,
    channel: {
      id: data.channel.id,
      name: data.channel.name,
      owner: data.channel.owner,
    },
    content: {
      id: data.content.id,
      playbackID: data.content.playbackID,
      assetID: data.content.assetID,
    },
  };
}
export async function deleteVideo(id: string): Promise<void> {
  const { status } = await $axios.delete(`https://api.swish.tv/video/${id}`);
  switch (status) {
    case 400:
      throw new InvalidInputError();
    case 404:
      throw new ResourceNotFoundError('video', id);
    case 403:
      throw new AuthorizationError();
    case 500:
      throw new ServerError();
  }
}
