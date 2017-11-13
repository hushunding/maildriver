import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SignupUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string; password: string }) { }

  ngOnInit() {
  }
  onNoClick()
  {
    this.dialogRef.close()
  }

}
