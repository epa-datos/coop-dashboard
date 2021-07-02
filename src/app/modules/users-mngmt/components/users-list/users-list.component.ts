import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { UsersMngmtService } from '../../services/users-mngmt.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['email', 'first_name', 'last_name', 'created_at', 'action'];

  private users: User[] = [];
  dataSource = new MatTableDataSource<User>(this.users);

  getReqStatus = 0;
  deleteReqStatus = 0;
  errorMsg: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private usersMngmtService: UsersMngmtService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.loadPaginator();
  }

  loadPaginator() {
    // paginator setup
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;

      return `${startIndex + 1} - ${endIndex} de ${length}`;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.getReqStatus = 1;
    this.usersMngmtService.getUsers()
      .subscribe(
        (res: User[]) => {
          this.users = res;
          this.dataSource = new MatTableDataSource<User>(this.users);
          this.dataSource.paginator = this.paginator;
          this.getReqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[users-list.component]: ${errorMsg}`);
          this.getReqStatus = 3;
        }
      )
  }

  removeUser(user: User) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        question: '¿Eliminar usuario?',
        content: [
          `El usuario ${user.email} ya no podrá accesar a la plataforma. ¿Estás seguro de eliminarlo de manera permanente?`
        ]
      }
    });

    dialogRef.afterClosed().subscribe(modalResp => {
      // if modal response exists (not undefined) convert modal response to boolean type
      if (!!modalResp) {
        const resp = (modalResp === 'true');
        if (resp) {
          this.deleteUser(user)
        }
      }
    });
  }

  deleteUser(user) {
    this.deleteReqStatus = 1;
    this.usersMngmtService.deleteUser(user.id)
      .subscribe(
        res => {
          this.getUsers();
          this.errorMsg && delete this.errorMsg;
          this.deleteReqStatus = 2;
          this.restoreDeleteReqStatus();
        },
        error => {
          this.errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[users-list.component]: ${this.errorMsg}`);
          this.deleteReqStatus = 3;
        }
      )
  }

  restoreDeleteReqStatus() {
    setTimeout(() => {
      this.deleteReqStatus = 0;
    }, 5000)
  }
}
