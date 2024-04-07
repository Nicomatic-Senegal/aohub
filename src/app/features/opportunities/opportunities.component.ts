import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/project/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Project } from '../interfaces/project.model';
import { PartnerService } from '../services/partner/partner.service';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent {
  token!: string;
  listProject: Project[] = [];
  listDays: number[] = [];
  searchData: Project[] = [];
  totalItems = 18;
  itemPerPage = 2;
  currentPage = 1;
  // startIndex = 1;
  // endIndex = 4;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private projectService: ProjectService,
    private partnerService: PartnerService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
    }

  ngOnInit(): void {
    this.loadAllProjects();
    // this.totalItems = this.listProject.length;
  }

  loadAllProjects() {
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
          
          console.log(this.listProject);
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
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap((event:KeyboardEvent) => {
            console.log(event)
            console.log(this.searchInput.nativeElement.value)
            this.performSearch(this.searchInput.nativeElement.value);
          })
      )
      .subscribe();
  }

  performSearch(query: string) {
    if (query) {
      this.projectService.searchProject(this.token, query).subscribe({
        next: (data) => {
          this.listProject = [];
          this.listProject.push(data);
          this.listProject = this.listProject.flatMap(data => data);
          console.log(this.listProject);
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.loadAllProjects();
    }
  }

  onApply(id: number) {
    this.router.navigate(['apply-project'], { queryParams: { id: id } });
  }

  navigate(link: string) {
    this.router.navigate(['apply-project']);
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * (this.itemPerPage);
    const end = start + this.itemPerPage;

    return this.listProject.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  formatProjectCount(count: number): string {
    return count.toString().padStart(2, '0');
  }
}
