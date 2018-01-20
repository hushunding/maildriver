import { Component, AfterViewInit, ViewChild, ViewChildren, EventEmitter, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter'
import { SaveNode, SaveNodeApi } from '../../share/fsSaveNode';
import { MatSort, SortDirection, MatButton, MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountServerService } from '../login-wind/account-server.service';
import { CmdChnService } from '../cm-chn/cmd-chn.service';
import { ActivationEnd } from '@angular/router/src/events';
import { IMailAccountCmd, ICmdReslut } from '../../share/ICmdChn';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements AfterViewInit {
  account: IMailAccountCmd;

  isRateLimitReached: boolean;
  isLoadingResults: boolean;
  resultsLength = 0;
  refresh: RefreshTable;

  dataSource = new MatTableDataSource<SaveNode>();
  getfileList: GetFileList;
  displayedColumns = ['select', 'name', 'fileSize'];
  selection = new SelectionModel<number>(true, []);
  myViewStack: SaveNode[];

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('refresh') btn: MatButton;
  @ViewChild('upfile') _upfile: ElementRef;
  @ViewChild('upfold') _upfold: ElementRef;
  get UpFile() {
    return (this._upfile.nativeElement as HTMLInputElement);
  }
  get UpFold() {
    return (this._upfold.nativeElement as HTMLInputElement);
  }
  constructor(private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private accoutSvr: AccountServerService, private cmdChn: CmdChnService) {
    this.router.events.filter(event => event instanceof ActivationEnd)
      .subscribe(event => this.loginAndInit())
    this.initPathStack();
  }
  loginAndInit(): any {
    this.route.params.subscribe(params => { this.account = this.accoutSvr.findFullUser(params.username) })
    this.cmdChn.send<ICmdReslut>('LogandInit', this.account)
      .subscribe(reslut => null);
    throw new Error("Method not implemented.");
  }

  onGetUploadFile(event) {
    console.log('upload file', this.UpFile.files);
    this.UpFile.value = ""
  }
  onGetUploadFold(event) {
    console.log(`upload fold`, this.UpFold.files);
    this.UpFold.value = ""
  }
  ngAfterViewInit() {
    this.refresh = new RefreshTable();
    this.getfileList = new GetFileList(this.http);

    const displayDataChanges = [
      this.sort.sortChange,
      this.refresh.refreshData
      // this.paginator.page
    ];
    Observable.merge(...displayDataChanges)
      .startWith(null)
      .switchMap((params: any) => {
        this.isLoadingResults = true;
        const isForce = params != null && params['isForce'] ? params['isForce'] : false;
        return this.getfileList!.getRepoIssues(
          this.refresh.pathIndex, this.sort.active, this.sort.direction, isForce);
        // this.paginator.pageIndex
      })
      .map((data: SaveNodeApi) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;
        return data.items;
      })
      .catch(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return Observable.of([]);
      })
      .subscribe(data => this.dataSource.data = data);
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  refreshTable() {
    // this.refresh.isForce = true;
    this.refresh.refreshData.emit({ isForce: true });
    // this.selection.toggle(2);
  }

  isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    return this.selection.selected.length === this.resultsLength;
  }

  masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(data => this.selection.select(data._nodeIndex));
    }
  }

  CellClick($event: MouseEvent, node: SaveNode) {
    this.myViewStack.push(node);
    this.selection.clear();
    $event.stopPropagation();
    //this.selection.toggle(node._nodeIndex);

    console.log(node);
  }
  initPathStack() {
    this.myViewStack = [{ _nodeIndex: -1, _name: '我的邮盘' }];
  }
  pathClick(node: SaveNode | null) {
    if (node === null) {
      this.initPathStack();
    } else {
      while (this.myViewStack.length > 0 && this.myViewStack[this.myViewStack.length - 1]._nodeIndex !== node._nodeIndex) {
        this.myViewStack.pop();
      }
    }

  }
}
class RefreshTable {
  pathIndex = -1;
  refreshData: EventEmitter<{ isForce: boolean }> = new EventEmitter(true);
}

export class GetFileList {
  getRepoIssues(_nodeIndex: number, sort: string, order: SortDirection, isForce: boolean): Observable<SaveNodeApi> {
    const href = 'http://127.0.0.1:10800/csapi';
    const requestUrl = `${href}?_nodeIndex=${_nodeIndex}&sort=${sort}&order=${order}&isForce=${isForce}`;
    const boby = { cmd: 'fileList', arg: { _nodeIndex, sort, order, isForce } };
    // return this.http.post<SaveNodeApi>(href, JSON.stringify(boby));
    const es = new Array<SaveNode>();
    for (let index = 0; index < 100; index++) {
      es.push({ _nodeIndex: index, _name: `${index}`, _fileSize: order === 'asc' ? index : 100 - index });
    }
    return Observable.of({ total_count: es.length, items: es });
  }
  constructor(private http: HttpClient) { }
}
