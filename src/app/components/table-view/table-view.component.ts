import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, Subject, takeUntil, tap} from "rxjs";
import {IElement, TableService} from "../../services/table.service";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AsyncPipe} from "@angular/common";
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {CellEditComponent} from "../cell-edit/cell-edit.component";
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    AsyncPipe
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableViewComponent {
  private tableService = inject(TableService);
  readonly dialog = inject(MatDialog);

  unsubscribe$: Subject<void> = new Subject<void>();
  isLoading: WritableSignal<boolean> = signal(false);

  elements$ = this.tableService.elementsData$;
  elementSignal = signal(this.elements$);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  ngOnInit() { }

  editElement(rowData: IElement, colName: string) {
    console.log(rowData, colName)
    const dialogRef = this.dialog.open(CellEditComponent, {
      width: '250px',
      data: {rowData, colName},
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(result => {
      console.log(`Dialog result: ${result}, ${colName} , ${rowData.position}`);
      if (result) {
        this.tableService.updateProperty(rowData.position, colName, result);
      } else {
        // TODO handle error
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.elementSignal.update(() => this.elements$
      .pipe(
        tap(() => this.isLoading.set(true)),
        debounceTime(2000),
        distinctUntilChanged(),
        map((elements) => elements.filter((e: IElement) => {
          return  e && Object.values(e).some((item) => typeof item === 'string'
            && item.toLowerCase().includes(filterValue)
            || typeof item === 'number' && item.toString().toLowerCase().includes(filterValue))
        })),
        tap(() => this.isLoading.set(false))
      ))
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
