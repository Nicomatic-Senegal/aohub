import { Component } from '@angular/core';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent {
  projets = [
    [
      [
        "nicomatic.svg",
        "Mame Diarra Bousso",
        "Nicomatic",
        "3 jours",
        "2",
        "Développement d'un Nouveau Connecteur Personnalisé",
        "Concevoir et fabriquer un connecteur sur mesure répondant aux besoins spécifiques d'un système électronique complexe",
        "Défense et sécurité",
        "1800",
        "Contractuel",
        "08/10/2024",
        "3 Mois"
      ],
      [
        "Plasturgie", "Sourcing", "Prototypist", "Assemblage", "Metallurgie", "Technicien", "Chef De Projet"
      ]
    ],
    [
      [
        "nicomatic.svg",
        "Xavier",
        "Inhub",
        "6 jours",
        "8",
        "Renouvellement d'un Ancien Connecteur",
        "Concevoir et fabriquer un connecteur sur mesure répondant aux besoins spécifiques d'un système électronique complexe",
        "Aéoronautique et sécurité",
        "2100",
        "Personnel",
        "09/11/2023",
        "2 Mois"
      ],
      [
        "Plasturgie", "Sourcing", "Prototypist", "Assemblage", "Metallurgie", "Technicien", "Chef De Projet"
      ]
    ],
  ];
}
