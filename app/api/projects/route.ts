import { ProjectType } from "@/contexts/dashboard.context";

export async function GET () {
    const projects: ProjectType[] = [
        {
            id: "#Oe31b70H",
            name: "T2 VITRY",
            date: "23 Juin 2024",
            address: "337 Centre Cial V Deux, 94400 Vitry-sur-Seine",
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
            stateOfPlay: "QUARTIER GARE-JEAN-JAURÈS - VITRY SUR SEINE (94400). Studio dans une copropriété sécurisée avec gardien et espaces verts, à proximité des commodités.",
            marksMostUsed: [{ mark: "Ikea", percentage: 26 }, { mark: "H&M home", percentage: 14 }, { mark: "Diptyque", percentage: 19 }, { mark: "Zara home", percentage: 32 }, { mark: "Benatura", percentage: 9 }],
            costEstimation: {
                withAid: 178000,
                withoutAid: 213000
            },
            status: "inprogress",
            lastUpdate: "17 September 2024",
            id_bouquet: "#Oe31b70k",
            id_design: "#Zk41b70H",
            authorName: "Saikou",
            image: "/dalle"
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
            stateOfPlay: "Dans un secteur sécurisé, appartement type 4 de 92,83 m² avec séjour climatisé, cuisine indépendante et chambres avec placard.",
            marksMostUsed: [{ mark: "Ikea", percentage: 14 }, { mark: "H&M home", percentage: 26 }, { mark: "Diptyque", percentage: 32 }, { mark: "Zara home", percentage: 19 }, { mark: "Benatura", percentage: 9 }],
            costEstimation: {
                withAid: 37000,
                withoutAid: 102000
            },
            status: "inprogress",
            lastUpdate: "17 September 2024",
            id_bouquet: "#SAa785m",
            id_design: "#kZrKO8a",
            authorName: "Kevin",
            image: "/placeholder.svg"
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
          stateOfPlay: "Situé dans un quartier familial et calme à Caudéran, ce duplex de charme est idéal pour les familles cherchant proximité et tranquillité.",
          marksMostUsed: [{ mark: "Ikea", percentage: 18 }, { mark: "H&M home", percentage: 22 }, { mark: "Diptyque", percentage: 32 }, { mark: "Zara home", percentage: 9 }, { mark: "Benatura", percentage: 19 }],
          costEstimation: {
              withAid: 45600,
              withoutAid: 98630
          },
          status: "inprogress",
          lastUpdate: "14 September 2024",
          id_bouquet: "#eR5mL9",
          id_design: "#nB89mk",
          authorName: "Ilyas",
          image: "/dalle"
        },
        {
            id: "#dfej993",
            name: "T4 Toulouse",
            date: "15 Mars 2023",
            address: "10 Rue des Chalets, 31000 Toulouse",
            actualEnergyRating: "c",
            targetedEnergyRating: "b",
            features: {
                servicesAndAccessibility: ["Ascenseur", "Gardien"],
                outsite: ["Jardin"],
                additionalAres: ["Garage", "Cave"],
                hygiene: ["Salle de bain", "Toilettes", "Douche italienne"],
                size: "98m²",
                roomsNumber: 6,
                floorsNumber: 2
            },
            stateOfPlay: "Magnifique T4 situé dans un quartier résidentiel de Toulouse. Proche des commodités, des écoles et du métro.",
            marksMostUsed: [{ mark: "Maisons du Monde", percentage: 20 }, { mark: "Leroy Merlin", percentage: 25 }, { mark: "Habitat", percentage: 30 }],
            costEstimation: {
                withAid: 56000,
                withoutAid: 145000
            },
            status: "completed",
            lastUpdate: "22 Avril 2024",
            id_bouquet: "#Zxc35Ml",
            id_design: "#Pmf98Aq",
            authorName: "Saikou",
            image: "/dalle"
        },
        {
            id: "#Qow564A",
            name: "Loft Lyon",
            date: "1 Janvier 2024",
            address: "5 Quai Jean Moulin, 69001 Lyon",
            actualEnergyRating: "b",
            targetedEnergyRating: "a",
            features: {
                servicesAndAccessibility: ["Ascenseur", "Gardien"],
                outsite: ["Terrasse"],
                additionalAres: ["Parking", "Cave", "Bureau"],
                hygiene: ["Salle de bain", "Toilettes", "Jacuzzi"],
                size: "150m²",
                roomsNumber: 10,
                floorsNumber: 2
            },
            stateOfPlay: "Loft spacieux avec une vue imprenable sur la Saône. Parfait pour ceux qui recherchent du luxe et du confort au cœur de Lyon.",
            marksMostUsed: [{ mark: "Ikea", percentage: 18 }, { mark: "Muji", percentage: 25 }, { mark: "Alessi", percentage: 30 }],
            costEstimation: {
                withAid: 75000,
                withoutAid: 250000
            },
            status: "completed",
            lastUpdate: "10 Janvier 2024",
            id_bouquet: "#tG8c9f",
            id_design: "#nP9c8G",
            authorName: "Kevin",
            image: "/dalle"
        },
        {
            id: "#Jkl782D",
            name: "Maison Lille",
            date: "10 Février 2024",
            address: "25 Rue des Arts, 59000 Lille",
            actualEnergyRating: "c",
            targetedEnergyRating: "b",
            features: {
                servicesAndAccessibility: ["Ascenseur", "Interphone"],
                outsite: ["Jardin", "Piscine"],
                additionalAres: ["Garage", "Cave"],
                hygiene: ["Salle de bain", "Toilettes", "Douche à l'italienne"],
                size: "120m²",
                roomsNumber: 7,
                floorsNumber: 2
            },
            stateOfPlay: "Charmante maison de ville dans le Vieux-Lille, proche des commerces et des écoles. Parfaite pour une famille.",
            marksMostUsed: [{ mark: "Ikea", percentage: 20 }, { mark: "Maison du Monde", percentage: 30 }, { mark: "But", percentage: 25 }],
            costEstimation: {
                withAid: 70000,
                withoutAid: 180000
            },
            status: "inprogress",
            lastUpdate: "12 Septembre 2024",
            id_bouquet: "#Hyt67Jh",
            id_design: "#PqzR9l8",
            authorName: "Saikou",
            image: "/dalle"
        },
        {
            id: "#Pko900B",
            name: "Villa Nice",
            date: "30 Mars 2024",
            address: "12 Avenue Jean Médecin, 06000 Nice",
            actualEnergyRating: "b",
            targetedEnergyRating: "a",
            features: {
                servicesAndAccessibility: ["Gardien", "Digicode"],
                outsite: ["Terrasse", "Piscine"],
                additionalAres: ["Garage", "Cave", "Atelier"],
                hygiene: ["Salle de bain", "Toilettes", "Baignoire"],
                size: "200m²",
                roomsNumber: 8,
                floorsNumber: 2
            },
            stateOfPlay: "Villa de luxe située à Nice, offrant une vue panoramique sur la mer Méditerranée. Un bien d'exception avec des prestations haut de gamme.",
            marksMostUsed: [{ mark: "Roche Bobois", percentage: 40 }, { mark: "Alessi", percentage: 30 }, { mark: "Muji", percentage: 20 }],
            costEstimation: {
                withAid: 1200000,
                withoutAid: 2800000
            },
            status: "completed",
            lastUpdate: "5 Septembre 2024",
            id_bouquet: "#PoiU12k",
            id_design: "#MnB78Xo",
            authorName: "Kevin",
            image: "/dalle"
        },
        {
            id: "#Ghf894P",
            name: "Maison Lyon",
            date: "12 Août 2024",
            address: "14 Rue des Marronniers, 69002 Lyon",
            actualEnergyRating: "d",
            targetedEnergyRating: "b",
            features: {
                servicesAndAccessibility: ["Interphone", "Digicode"],
                outsite: ["Jardin", "Terrasse"],
                additionalAres: ["Garage", "Bureau"],
                hygiene: ["Salle de bain", "Toilettes", "Douche à l'italienne"],
                size: "110m²",
                roomsNumber: 6,
                floorsNumber: 2
            },
            stateOfPlay: "Maison familiale avec un grand jardin dans un quartier calme, proche des écoles et des commerces. Idéale pour une famille.",
            marksMostUsed: [{ mark: "Ikea", percentage: 22 }, { mark: "Conforama", percentage: 28 }, { mark: "Castorama", percentage: 30 }],
            costEstimation: {
                withAid: 85000,
                withoutAid: 190000
            },
            status: "inprogress",
            lastUpdate: "20 Août 2024",
            id_bouquet: "#Uyt43Ln",
            id_design: "#Mnb56Kq",
            authorName: "Ilyas",
            image: "/dalle"
        }
    ];

    return Response.json(projects);
}
