import { Component } from '@angular/core';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Project } from '../interfaces/project.model';
import { PartnerService } from '../services/partner/partner.service';
import { PartnerDTO } from '../interfaces/partner.model';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent {
  token!: string;
  listProject: Project[] = [];
  listDays: number[] = [];

  constructor(
    private projectService: ProjectService,
    private partnerService: PartnerService,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private router: Router,
    private authService: AuthService,
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
    }

  ngOnInit(): void {
    this.projectService.getAllProjects(this.token).subscribe({
      next: (data) => {
        data.forEach((project: { applicant: Project; }) => {
          this.partnerService.getPartnerById(this.token, project.applicant.id).subscribe({
            next: (applicant) => {
              project.applicant = applicant;
            },
            error: (err) => {
              console.log(err);
              this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
                timeOut: 3000,
                positionClass: 'toast-top-center',
              });
            }
          });

          const currentDate = new Date();
          const earliestDeadline = new Date(data.earliestDeadline);
          const differenceInMilliseconds = earliestDeadline.getTime() - currentDate.getTime();
          const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

          this.listDays.push(differenceInDays);

          this.listProject.push(data);
          this.listProject = this.listProject.flatMap(data => data)
          
          console.log(project);
        });

        const currentDate = new Date();
        const earliestDeadline = new Date(data.earliestDeadline);
        const differenceInMilliseconds = earliestDeadline.getTime() - currentDate.getTime();
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        this.listDays.push(differenceInDays);

        this.listProject.push(data);
        this.listProject = this.listProject.flatMap(data => data)

        // console.log(data);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
    // console.log(this.listDays);
    
  }

  onApply(id: number) {
    // this.router.navigate(['apply-project', id]);
    this.router.navigate(['apply-project'], { queryParams: { id: id } });
  }

  navigate(link: string) {
    this.router.navigate(['apply-project']);
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
