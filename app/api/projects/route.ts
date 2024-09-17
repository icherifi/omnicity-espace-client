import { ProjectType } from "@/contexts/dashboard.context";

export async function GET () {
    const projects: ProjectType[] = [
        {
            id: "#Oe31b70H",
            name: "T2 VITRY",
            date: "23 Juin 2024",
            address: "337 Centre Cial V Deux, 94400",
            actualEnergyRating: "e",
            targetedEnergyRating: "b",
            features: {
                servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
                outsite: ["Balcon"],
                additionalAres: ["Parking", "Cave"],
                hygiene: ["Salle de bain", "Toilettes"],
                size: "65m²",
                roomsNumber: 5,
                floorsNumber: 2
            },
            stateOfPlay: "QUARTIER GARE-JEAN-JAURÈS - VITRY SUR SEINE (94400) Dans une copropriété sécurisé avec gardien et espace vert, studio comprenant : entrée, séjour donnant sur balcon, cuisine, et une salle de bains avec wc, et une cave. 10 min du métro Mairie d'Ivry et du RERC et proche de toutes commodites. Référence agence : 563",
            marksMostUsed: [{mark: "Ikea", percentage: 26}, {mark: "H&M home", percentage: 14}, {mark: "Diptyque", percentage: 19}, {mark: "Zara home", percentage: 32}, {mark: "Benatura", percentage: 9}],
            costEstimation: {
                withAid: 178000,
                withoutAid: 213000
            },
            status: "inprogress",
            lastUpdate: "17 September 2024",
            id_bouquet: "#Oe31b70k",
            id_design: "#Zk41b70H"
        },
        {
            id: "#SkP548LM",
            name: "Studio Paris",
            date: "11 Octobre 2023",
            address: "196 Rue Marcadet, 75018 Paris, France",
            actualEnergyRating: "d",
            targetedEnergyRating: "a",
            features: {
                servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
                outsite: ["Balcon"],
                additionalAres: ["Parking", "Cave", "Grenier"],
                hygiene: ["Salle de bain", "Toilettes", "Baignoire"],
                size: "42m²",
                roomsNumber: 6,
                floorsNumber: 0
            },
            stateOfPlay: "Dans un secteur retiré sécurisé , venez découvrir cet appartement en R+1 de type 4 de 92,83 m² comprenant un séjour climatisé, une cuisine indépendante aménagée, trois chambres climatisées dont deux avec placard, une salle de bains; un wc, une véranda de 22.65 m²",
            marksMostUsed: [{mark: "Ikea", percentage: 14}, {mark: "H&M home", percentage: 26}, {mark: "Diptyque", percentage: 32}, {mark: "Zara home", percentage: 19}, {mark: "Benatura", percentage: 9}],
            costEstimation: {
                withAid: 37000,
                withoutAid: 102000
            },
            status: "inprogress",
            lastUpdate: "17 September 2024",
            id_bouquet: "#SAa785m",
            id_design: "#kZrKO8a"
        },
        {
          id: "#8olHJ6m",
          name: "Duplex Bordeaux",
          date: "5 mai 2024",
          address: "6 Rue Léonce Jugla, 33800 Bordeaux",
          actualEnergyRating: "f",
          targetedEnergyRating: "c",
          features: {
              servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
              outsite: ["Balcon"],
              additionalAres: ["Parking", "Cave", "Grenier"],
              hygiene: ["Salle de bain", "Toilettes", "Baignoire"],
              size: "87m²",
              roomsNumber: 9,
              floorsNumber: 1
          },
          stateOfPlay: "Quartier familial, authentique et dynamique à l'identité affirmée, Caudéran est une ancienne commune de Bordeaux Métropole qui a su conserver son patrimoine architectural avec ses traditionnelles échoppes et ses nombreux espaces verts. À seulement quelques minutes en vélo du centre-ville historique de Bordeaux, ses habitants profitent du calme résidentiel et des multiples commerces de proximité Ces nombreux atouts font de Caudéran, un quartier de charme, très attractif",
          marksMostUsed: [{mark: "Ikea", percentage: 18}, {mark: "H&M home", percentage: 22}, {mark: "Diptyque", percentage: 32}, {mark: "Zara home", percentage: 9}, {mark: "Benatura", percentage: 19}],
          costEstimation: {
              withAid: 45600,
              withoutAid: 98630
          },
          status: "inprogress",
          lastUpdate: "14 September 2024",
          id_bouquet: "#eR5mL9",
          id_design: "#nB89mk"
      }
    ]

    return Response.json(projects)
}