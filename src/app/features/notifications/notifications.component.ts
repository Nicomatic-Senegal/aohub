import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  groupedNotifications: { [key: string]: any[] } = {};
  ngOnInit() {
    this.groupNotificationsByDate();
  }

  notifications = [
    {
      title: 'Notification de Nouvelle Soumission',
      message: 'Notification pour informer les utilisateurs concernés de la soumission d\'un nouveau projet avec un résumé des détails clés...',
      time: 'Il y a 4h',
      date: new Date(),
      isRead: false
    },
    {
      title: 'Notification de Clôture des Soumissions',
      message: 'Alertes pour indiquer la fin de la période de soumission et le début du processus de filtrage',
      time: 'Il y a 2h',
      date: new Date(),
      isRead: false
    },
    {
      title: 'Notification de Réunion Planifiée',
      message: 'Confirmation de la planification d\'une réunion avec les détails du projet',
      time: 'Il y a 2h',
      date: new Date(),
      isRead: false
    },
    {
      title: 'Notification de Nouvelle Soumission',
      message: 'Notification pour informer les utilisateurs concernés de la soumission d\'un nouveau projet avec un résumé des détails clés...',
      time: 'Il y a 4h',
      date: new Date('2024-02-03'),
      isRead: false
    },
    {
      title: 'Notification de Sélection d\'Équipe Projet',
      message: 'Avis aux membres de l\'équipe projet sélectionnée sur les prochaines étapes et les tâches à accomplir.',
      time: '',
      date: new Date('2024-02-03'),
      isRead: false
    },
    {
      title: 'Notification de Sélection d\'Équipe Projet',
      message: 'Avis aux membres de l\'équipe projet sélectionnée sur les prochaines étapes et les tâches à accomplir.',
      time: '',
      date: new Date('2024-02-03'),
      isRead: false
    },
    {
      title: 'Notification de Sélection d\'Équipe Projet',
      message: 'Avis aux membres de l\'équipe projet sélectionnée sur les prochaines étapes et les tâches à accomplir.',
      time: '',
      date: new Date('2024-02-01'),
      isRead: false
    },
    {
      title: 'Notification de Sélection d\'Équipe Projet',
      message: 'Avis aux membres de l\'équipe projet sélectionnée sur les prochaines étapes et les tâches à accomplir.',
      time: '',
      date: new Date('2024-01-09'),
      isRead: false
    }
  ];

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  groupNotificationsByDate() {
    this.notifications.forEach(notification => {
      const dateKey = this.isToday(notification.date) ? 'Aujourd\'hui' : this.formatDate(notification.date);
      if (!this.groupedNotifications[dateKey]) {
        this.groupedNotifications[dateKey] = [];
      }
      this.groupedNotifications[dateKey].push(notification);
    });
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.groupNotificationsByDate();
  }

  markAsRead(notification: any) {
    notification.isRead = true;
  }

}
