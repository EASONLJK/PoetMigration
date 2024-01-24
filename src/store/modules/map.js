import * as turf from "@turf/turf";
import axios from "axios";

const state = {
  china: null,
  point: null,
  china_province: null,
  province_city: null,
  province_china: null,
  province_datas: null,
  poetMigration: null,
  qinlin_huaihe: null,
};

const getters = {
  isNorthOfLine: (state) => (lineCoords, pointCoords) => {
    const line = turf.lineString(lineCoords);
    const point = turf.point(pointCoords);
    const nearestPoint = turf.nearestPointOnLine(line, point);
    return point.geometry.coordinates[1] > nearestPoint.geometry.coordinates[1];
  },
};

const mutations = {
  SET_DATA(state, { key, data }) {
    state[key] = data;
  },
};

const actions = {
  fetchData({ commit }) {
    let url = "http://127.0.0.1:5000/mapbox/";

    return axios
      .all([
        axios.get(url + "china"),
        axios.get(url + "china_province"),
        axios.get(url + "province_city"),
        axios.get(url + "province_china"),
        axios.get(url + "poetMigration"),
        axios.get(url + "qinlin_huaihe"),
      ])
      .then(
        axios.spread(
          (
            china,
            china_province,
            province_city,
            province_china,
            poetMigration,
            qinlin_huaihe
          ) => {
            commit("SET_DATA", { key: "china", data: china.data });
            commit("SET_DATA", {
              key: "china_province",
              data: china_province.data,
            });
            commit("SET_DATA", {
              key: "province_city",
              data: province_city.data,
            });
            commit("SET_DATA", {
              key: "province_china",
              data: province_china.data,
            });
            commit("SET_DATA", {
              key: "poetMigration",
              data: poetMigration.data,
            });
            commit("SET_DATA", {
              key: "qinlin_huaihe",
              data: qinlin_huaihe.data,
            });
          }
        )
      )
      .catch((error) => {
        console.error(error);
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
