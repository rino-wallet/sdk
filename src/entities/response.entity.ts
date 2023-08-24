export class ResponseEntity<T> {
  count: number;
  next: string;
  previous: string;
  results: T;
}
