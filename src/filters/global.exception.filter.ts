import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AxiosError } from "axios";

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = "Internal Server Error";

    if (exception instanceof AxiosError) {
      const axiosError = exception as AxiosError;
      if (axiosError.response) {
        const { status, statusText, data } = axiosError.response;
        response.status(status).json({ error: statusText, data });
        return;
      }
    } else if (exception instanceof HttpException) {
      const httpException = exception as HttpException;
      const status = httpException.getStatus();
      errorMessage = httpException.message;
      response.status(status).json({ error: errorMessage });
      return;
    }

    response.status(httpStatus).json({ error: errorMessage });
  }
}
