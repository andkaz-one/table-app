import {Component, Inject} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-cell-edit',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './cell-edit.component.html',
  styleUrl: './cell-edit.component.scss'
})

export class CellEditComponent {
  value!: any;
  private propertyName!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CellEditComponent>) {
    this.value = data.rowData[data.colName];
    this.propertyName = data.colName;
  }

  submit(): void {
    this.dialogRef.close(this.value.trim());
  }
}
