import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = (id, newDetails) => {
  const request = axios.put(`${baseUrl}/${id}`, newDetails);
  return request.then((response) => response.data);
};

const exportedObject = {
  create,
  getAll,
  deletePerson,
  update,
};

export default exportedObject;
