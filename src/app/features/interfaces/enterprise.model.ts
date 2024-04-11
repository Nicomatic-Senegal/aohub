export interface EnterpriseDTO {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  ninea: string;
  description: string;
  imageBase64Content: string | null;  // Utilisation de "null" pour représenter l'absence d'image
  imageUrl: string | null;  // Utilisation de "null" pour représenter l'absence d'URL d'image
}
