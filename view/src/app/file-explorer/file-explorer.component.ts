import { Component, OnInit, ViewChild, ViewChildren, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
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

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('refresh') btn: MatButton;
  constructor(private http: Http) {
    this.displayedColumns = ['name', 'fileSize'];
  }

  ngOnInit() {
    this.refresh = new RefreshTable();
    this.getfileList = new GetFileList(this.http);
    this.dataSource = new FsDataSource(this.getfileList, this.sort, this.refresh);
  }
  refreshTable() {
    // this.refresh.isForce = true;
    this.refresh.refreshData.emit({ isForce: true });
  }
}
class RefreshTable {
  isForce = false;
  refreshData: EventEmitter<{ isForce: boolean }> = new EventEmitter();
}

export class GetFileList {
  getRepoIssues(sort: string, order: SortDirection, isForce: boolean): Observable<SaveNodeApi> {
    const es = new Array<SaveNode>();
    for (let index = 0; index < 100; index++) {
      es.push({ _name: `${index}`, _fileSize: order === 'asc' ? index : 100 - index });
    }
    return Observable.of({ total_count: es.length, items: es });
  }
  constructor(private http: Http) { }
}
export class FsDataSource extends DataSource<SaveNode> {
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  constructor(private db: GetFileList, private sort: MatSort, private refresh: RefreshTable) {
    super();
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
          this.sort.active, this.sort.direction, isForce);
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
      });
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  disconnect() { }
}
