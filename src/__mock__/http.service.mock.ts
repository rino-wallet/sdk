import { PartialFuncReturn, createMock } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";
import { AxiosHeaders, AxiosResponse, AxiosRequestConfig } from "axios";
import { Observable, of } from "rxjs";

import { httpServiceMockMap } from "./http.service.mock.map";

export const httpServiceMock = createMock<HttpService>({
  get: jest.fn((url, config): PartialFuncReturn<Observable<AxiosResponse>> => {
    return processRequest("GET", url, config);
  }),
  post: jest.fn((url, _, __): PartialFuncReturn<Observable<AxiosResponse>> => {
    return processRequest("POST", url);
  }),
  put: jest.fn((url, _, __): PartialFuncReturn<Observable<AxiosResponse>> => {
    return processRequest("PUT", url);
  }),
  patch: jest.fn((url, _, __): PartialFuncReturn<Observable<AxiosResponse>> => {
    return processRequest("PATCH", url);
  }),
});

const processRequest = (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  config?: AxiosRequestConfig,
): PartialFuncReturn<Observable<AxiosResponse>> => {
  const response = createMockAxiosResponse({});
  const httpString = createHttpString(method, url, config);
  const mockData = httpServiceMockMap[httpString];

  if (mockData) {
    response.status = 200;
    response.data = mockData;
  } else {
    response.status = 404;
  }

  return of(response);
};

const createMockAxiosResponse = (
  response: Partial<AxiosResponse>,
): AxiosResponse => {
  const configHeaders = new AxiosHeaders();

  return {
    data: response.data || {},
    status: response.status || 200,
    statusText: response.statusText || "",
    headers: response.headers || { "Content-Type": "application/json" },
    config: response.config || {
      headers: configHeaders,
    },
    request: response.request,
  };
};

const createHttpString = (
  method: string,
  url: string,
  config?: AxiosRequestConfig,
) => {
  let query = "";
  if (config && config.params) {
    query =
      "?" +
      Object.entries(config.params)
        .map((entry) => entry.join("="))
        .join("&");
  }
  return `${method} ${url}${query}`;
};
