import axios from 'axios';
import api from '../auths/api';

const getListUser = () => {
    return axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/api/v1/list-user`);
}
const getUser = (id) => {
    return axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/api/v1/get-user/${id}`);
}
const Login = (username, password) => {
    return axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/api/v1/login`, { username: username, password: password });
}
const getListSchedule = (data) => {
    return api.post(`/management/api/v1/list-schedule`, data);
}
const getSchedule = (id) => {
    return api.get(`/management/api/v1/get-schedule/${id}`);
}
const getChargeOf = (id) => {
    return api.get(`/management/api/v1/get-charge_of/${id}`,);
}
const getTimeLocation = (id) => {
    return api.get(`/management/api/v1/get-time_location/${id}`,);
}
const getMakeupHair = (id) => {
    return api.get(`/management/api/v1/get-makeup_hair/${id}`,);
}
const getStylist = (id) => {
    return api.get(`/management/api/v1/get-stylist/${id}`,);
}
const createDevice = (data) => {
    return api.post(`/management/api/v1/create-device`, data,);
}
const deleteDevice = (id) => {
    return api.delete(`/management/api/v1/delete-device/${id}`,);
}
export {
    getListUser, getUser, Login, getListSchedule, getSchedule, getChargeOf,
    getTimeLocation, getMakeupHair, getStylist, createDevice, deleteDevice,
}
