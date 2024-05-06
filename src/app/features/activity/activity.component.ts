import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { Project } from '../interfaces/project.model';
import { ProjectService } from '../services/project/project.service';
import { UserService } from '../services/user/user.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  token: string;
  totalItems = 0;
  itemPerPage = 4;
  currentPage = 1;
  allProjects: Project[] = [];
  listProject: Project[] = [];
  allEnterprise: EnterpriseDTO[] = [];
  currentConnectedUser?: PartnerDTO;
  nbProjectsInProgres: number = 0;
  nbProjectsFinished: number = 0;
  nbProjectsOnHold: number = 0;
  nbProjectsArchived: number = 0;
  selectedDate: Date | null = new Date();
  selectedStatus: string[] = [];
  selectedEnterprise: string[] = [];
  selectedMonth: string[] = [];
  selectedYears: string[] = [];
  listMarkets: any;
  months: string[] = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
  ];
  years = [
    "2012", "2013", "2014", "2015", "2016", "2017",
    "2018", "2019", "2020", "2021", "2022", "2023", "2024"
  ];;


  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private enterpriseService: EnterpriseService,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    if(window.innerHeight < 600) {
      this.itemPerPage = 2;
    }
    this.loadCurrentConnectedUser();
    this.loadAllProjects();
    this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    this.loadAllEnterprises();
  }

  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);

    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-right',
         });
        }
      })
    }
  }

  loadAllEnterprises() {
    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        this.allEnterprise = data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des entreprises", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  loadMyProjects(page: number, size: number) {
    this.listProject.splice(0, this.listProject.length);
    this.projectService.getMyProjects(this.token, page, size).subscribe({
      next: (data) => {
        this.listProject.push(data.projects);
        this.listProject = this.listProject.flatMap(data => data);
        this.totalItems = data.totalCount;

        this.listProject.forEach(project => {
          switch(project.status) {
            case 'IN_PROGRESS':
              this.nbProjectsInProgres++;
              break;
            case 'FINISHED':
              this.nbProjectsFinished++;
              break;
            case 'ON_HOLD':
              this.nbProjectsOnHold++;
              break;
            case 'ARCHIVED':
              this.nbProjectsArchived++;
              break;
            default:
              break;
          }
        });
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

  loadAllProjects() {
    this.projectService.getAllProjectsNoPagination(this.token).subscribe({
      next: (data) => {
        this.allProjects = data.projects;
        this.totalItems = this.allProjects.length;

        this.allProjects.forEach(project => {
          switch(project.status) {
            case 'IN_PROGRESS':
              this.nbProjectsInProgres++;
              break;
            case 'FINISHED':
              this.nbProjectsFinished++;
              break;
            case 'ON_HOLD':
              this.nbProjectsOnHold++;
              break;
            case 'ARCHIVED':
              this.nbProjectsArchived++;
              break;
            default:
              break;
          }
        });
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des marchés", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    });
  }

  changePage(page: number) {
    if(window.innerHeight < 600) {
      this.itemPerPage = 2;
    }
    this.currentPage = page;
    this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
  }

  changeFilter(value: string, flagUrl: string) {
  }

  displayProjectDetails(id: number) {
    this.router.navigate(['/project-options'], { queryParams: { id: id } });
  }

  onSelectDate(event: Event) {
    console.log(this.selectedDate);
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatus.includes(status);
  }

  isMonthSelected(month: string): boolean {
    return this.selectedMonth.includes(month);
  }

  isYearSelected(year: string): boolean {
    return this.selectedYears.includes(year);
  }

  isEnterpriseSelected(enterprise: string): boolean {
    return this.selectedEnterprise.includes(enterprise);
  }

  sortProjectsByStatus(status: string) {
    const index = this.selectedStatus.indexOf(status);
    if (index !== -1) {
      this.selectedStatus.splice(index, 1);
    } else {
      this.selectedStatus.push(status);
    }

    if (this.selectedStatus.length === 0) {
      this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    } else {
      this.listProject = this.listProject.filter(project => {
        return project.status !== undefined && this.selectedStatus.includes(project.status);
      });
    }
  }

  sortProjectsByMonth(month: string) {
    const index = this.selectedMonth.indexOf(month);
    if (index !== -1) {
      this.selectedMonth.splice(index, 1);
    } else {
      this.selectedMonth.push(month);
    }

    if (this.selectedMonth.length === 0) {
      this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    } else {
      // this.listProject = this.listProject.filter(project => {
      //   return project.markets !== undefined && this.selectedStatus.includes(project.markets);
      // });
    }
  }

  sortProjectsByYear(year: string) {
    const index = this.selectedYears.indexOf(year);
    if (index !== -1) {
      this.selectedYears.splice(index, 1);
    } else {
      this.selectedYears.push(year);
    }

    if (this.selectedYears.length === 0) {
      this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    } else {
      // this.listProject = this.listProject.filter(project => {
      //   return project.markets !== undefined && this.selectedStatus.includes(project.markets);
      // });
    }
  }

  sortProjectsByEnterprise(name: string) {
    const index = this.selectedEnterprise.indexOf(name);
    if (index !== -1) {
      this.selectedEnterprise.splice(index, 1);
    } else {
      this.selectedEnterprise.push(name);
    }

    if (this.selectedEnterprise.length === 0) {
      this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    } else {
      // this.listProject = this.listProject.filter(project => {
      //   return project.markets !== undefined && this.selectedStatus.includes(project.markets);
      // });
    }
  }
}
