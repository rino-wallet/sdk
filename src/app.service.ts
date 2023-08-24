import { Injectable } from "@nestjs/common";
import { Observable, map } from "rxjs";

import { RinoService } from "./rino/rino.service";
import { StatusEntity } from "./entities";

@Injectable()
export class AppService {
  constructor(private rinoService: RinoService) {}

  getHealth(): Observable<StatusEntity> {
    return this.rinoService
      .getHealth()
      .pipe(map((response) => new StatusEntity(response)));
  }
}
