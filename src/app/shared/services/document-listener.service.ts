import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DocumentListenerService {
  public documentClickEvent = new Subject<MouseEvent>();
}
