import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EventService } from '../../services/event/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Output() eventRemoved = new EventEmitter<any>();
  @Output() profilePictureRemovedEvent = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private authService: AuthService,
    private eventService: EventService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {

  }

  ngOnInit(): void {
  }

  dispatcher(route: string) {
    switch(route) {
      case 'logout':
        this.logout();
        break;
      case 'deleteEvent':
        this.deleteEvent(this.dialogData.token, this.dialogData.event.id);
        break;
      case 'deleteProfilePicture':
        this.deleteProfilePicture(this.dialogData.route);
        break;
      default:
        break;
    }
  }

  logout() {
    this.dialogRef.close();
    this.authService.logOut();
  }

  deleteEvent(token: string, eventId: number) {
    this.eventService.deleteEvent(token, eventId).subscribe({
      next: (data) => {
        this.toastr.success("success", "L'évènement a été supprimé avec succès", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
       this.eventRemoved.emit(eventId);
       this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la suppression de l'évènement", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    })
  }

  deleteProfilePicture(status: string) {
    this.profilePictureRemovedEvent.emit(status);
    this.dialogRef.close();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
