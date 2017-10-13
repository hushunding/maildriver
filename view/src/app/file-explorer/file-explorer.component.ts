import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import {Http} from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {SaveNode} from '../fsDesc/fsSaveNode';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {
  getfileList: GetFileList;
  displayedColumns = ['name', 'fileSize'];
  dataSource = new FsDataSource();

  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: Http) { }

  ngOnInit() {
    this.getfileList = new GetFileList(this.http);
  }

}

export class GetFileList
{
  constructor(private http: Http) { }
}
export class FsDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<SaveNode[]> {
    const es = new Array<SaveNode>();
    for (let index = 0; index < 100; index++) {
      es.push({ _name: `${index}`, _fileSize: index });
    }
    return Observable.of(es);
  }

  disconnect() { }
}
