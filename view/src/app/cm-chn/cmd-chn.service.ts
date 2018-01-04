import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CmdChnService {
  timer: number;
  eventmap = new Map<string, Array<{ cb: Function, _this?: any }>>();
  constructor(private http: HttpClient) {
    //return
    this.timer = window.setInterval(() => {
      this.send<Array<{ cmd: string, arg: any }>>('hb', '', true).subscribe(resp => {
        for (const event of resp) {
          const cbs = this.eventmap.get(event.cmd)
          if(cbs)
          for (const cbitem of cbs) {
            cbitem.cb.call(cbitem._this, event.arg);
          }
        }
      })
    }, 500)
  }
  send<T>(cmd: string, arg: any, ishb = false) {
    const href = `/${ishb?'hb':'csapi'}`;
    return this.http.post<T>(href, JSON.stringify({ cmd, arg }))
  }
  on(cmd: string, cb: Function, _this: any = null) {
    let eventArray: Array<{ cb: Function, _this?: any }>;
    if (!this.eventmap.has(cmd)) {
      eventArray = new Array<{ cb: Function, _this?: any }>();
      this.eventmap.set(cmd, eventArray)
    }
    else {
      eventArray = this.eventmap.get(cmd);
    }
    eventArray.push({ cb, _this })
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.timer);
  }

}
