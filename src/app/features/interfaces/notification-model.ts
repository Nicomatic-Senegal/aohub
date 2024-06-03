export interface NotificationDto {
  id?: number,
  opportunityEmail: boolean
  reminderEmail: boolean
  assigningEmail: boolean
  partner: {
    id: number
  }
}
