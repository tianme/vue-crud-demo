import service from '../axios';

const register = (params) => service.post('/user/register', params);

const getList = (params) => service.get('/user/list', { params });

const update = (params) => service.patch('/user/update', params);

const del = (params) => service.delete('/user/delete', { params });

export {
  register,
  getList,
  update,
  del,
};
