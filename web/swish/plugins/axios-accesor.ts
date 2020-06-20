import { Plugin } from '@nuxt/types';
import { initializeAxios } from '~/services/api';

const accessor: Plugin = ({ $axios }) => {
  initializeAxios($axios);
};

export default accessor;
