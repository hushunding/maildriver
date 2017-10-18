import { Component, OnInit, ViewChild, ViewChildren, EventEmitter } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { SaveNode, SaveNodeApi } from '../fsDesc/fsSaveNode';
import { MatSort, SortDirection, MatButton } from '@angular/material';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {
  refresh: RefreshTable;

  dataSource: FsDataSource;
  getfileList: GetFileList;
  displayedColumns: string[];
  selection = new SelectionModel<number>(true, []);
  myViewStack: SaveNode[];

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('refresh') btn: MatButton;
  constructor(private http: Http) {
    this.displayedColumns = ['select', 'name', 'fileSize'];
    this.initPathStack();
  }

  ngOnInit() {
    this.refresh = new RefreshTable();
    this.getfileList = new GetFileList(this.http);
    this.dataSource = new FsDataSource(this.getfileList, this.sort, this.refresh);
  }
  refreshTable() {
    // this.refresh.isForce = true;
    this.refresh.refreshData.emit({ isForce: true });
    // this.selection.toggle(2);
  }

  isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    return this.selection.selected.length === this.dataSource.resultsLength;
  }

  masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(data => this.selection.select(data._nodeIndex));
    }
  }

  CellClick(node: SaveNode) {
    this.myViewStack.push(node);
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
  refreshData: EventEmitter<{ isForce: boolean }> = new EventEmitter();
}

export class GetFileList {
  getRepoIssues(_nodeIndex: number, sort: string, order: SortDirection, isForce: boolean): Observable<SaveNodeApi> {
    const href = 'http://127.0.0.1:10800/csapi';
    const requestUrl = `${href}?_nodeIndex=${_nodeIndex}&sort=${sort}&order=${order}&isForce=${isForce}`;
    const boby = { cmd: 'fileList', arg: { _nodeIndex, sort, order, isForce } };
    return this.http.post(href, JSON.stringify(boby))
      .map(res => res.json() as SaveNodeApi);
    // const es = new Array<SaveNode>();
    // for (let index = 0; index < 100; index++) {
    //   es.push({ _nodeIndex: index, _name: `${index}`, _fileSize: order === 'asc' ? index : 100 - index });
    // }
    // return Observable.of({ total_count: es.length, items: es });
  }
  constructor(private http: Http) { }
}
export class FsDataSource extends DataSource<SaveNode> {
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  data: SaveNode[];
  constructor(private db: GetFileList, private sort: MatSort, private refresh: RefreshTable) {
    super();
    this.data = null;
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<SaveNode[]> {
    // const es = new Array<SaveNode>();
    // for (let index = 0; index < 100; index++) {
    //   es.push({ _name: `${index}`, _fileSize: index });
    // }
    // return Observable.of(es);
    const displayDataChanges = [
      this.sort.sortChange,
      this.refresh.refreshData
      // this.paginator.page
    ];
    return Observable.merge(...displayDataChanges)
      .startWith(null)
      .switchMap((params: any) => {
        this.isLoadingResults = true;
        const isForce = params != null && params['isForce'] ? params['isForce'] : false;
        return this.db.getRepoIssues(
          this.refresh.pathIndex, this.sort.active, this.sort.direction, isForce);
        // this.paginator.pageIndex
      })
      .map((data: SaveNodeApi) => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;
        this.data = data.items;
        return data.items;
      })
      .catch(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return Observable.of([]);
      });
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  disconnect() { }
}
