import { Type, applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiResponseOptions,
} from "@nestjs/swagger";

import { Page } from "../types";

export const ApiPaginatedResponse = <T extends Type<unknown>>(
  data: T,
  options: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(Page, data),
    ApiResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(Page) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(data) },
              },
            },
          },
        ],
      },
    }),
  );
