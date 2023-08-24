import { HttpModuleOptions, HttpModuleOptionsFactory } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createHttpOptions(): HttpModuleOptions | Promise<HttpModuleOptions> {
    const rinoEnv = this.configService.get<string>("RINO_ENV").toUpperCase();
    const baseURL = this.configService.get<string>(`RINO_API_URL_${rinoEnv}`);
    const apiKey = this.configService.get<string>("RINO_API_KEY");

    return {
      baseURL,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    };
  }
}
