import { Component } from '@angular/core';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent {
  listProject: any[] = [];

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private route: Router
    ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.listProject = data;
        console.log(this.listProject);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  openDialog(data: String) {
    // this.dialogRef.open(ApplyProjectDialogComponent, {
    //   // width: '80%',
    //   data: { data: data },
    //   panelClass: 'custom-modalbox'
    // });
  }

  navigate(link: String) {
    this.route.navigate(['apply-project']);
  }

  totalItems = 10;
  itemPerPage = 2;
  currentPage = 1;
  // startIndex = 1;
  // endIndex = 4;

  get paginatedDate() {
    const start = (this.currentPage - 1) * (this.itemPerPage);
    const end = start + this.itemPerPage;

    return this.listProject.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

}
