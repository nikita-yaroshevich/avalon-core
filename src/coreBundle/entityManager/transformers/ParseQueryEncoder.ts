import {QueryEncoder} from "@angular/http";
export class ParseQueryEncoder extends QueryEncoder {
  encodeKey(k: string): string {
    return k;
  }
  encodeValue(v: string): string {
    return v;
  }
}
