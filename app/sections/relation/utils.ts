export type Professional = {
  id: number;
  name: string;
  role: string;
  city: string;
  avatar: string;
  badge: string;
  badgeType: string;
  skills: string[];
  phone: string;
  email: string;
  company: string;
  companyLink: string;
  location: string;
  isNearby: boolean;
  isVerified: boolean;
  siret?: string;
  adresse?: string;
};

export const TRADES = [
  "Électricien",
  "Plombier",
  "Chauffagiste",
  "Isolation",
  "Menuisier",
  "Maçon",
  "Peintre",
  "Carreleur",
];

export const RGE_API_CONFIG = {
  baseUrl: "https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2/lines",
  rateLimit: {
    callsPerSecond: 10,
    callsPerMinute: 600
  },
  searchFields: {
    nom_entreprise: "Nom de l'entreprise",
    raison_sociale: "Raison sociale", 
    siret: "SIRET",
    domaine: "Domaine d'activité",
    nom_qualification: "Qualification",
    commune: "Commune",
    code_postal: "Code postal",
    adresse: "Adresse"
  },
  defaultSize: 20,
  maxSize: 100
};

export const RGE_DOMAINS = {
  "Chauffage": ["chauffage", "pompe à chaleur", "chaudière", "radiateur"],
  "Isolation": ["isolation", "isolation thermique", "isolation phonique"],
  "Menuiseries": ["menuiserie", "fenêtre", "porte", "baie vitrée"],
  "Électricité": ["électricité", "électricien", "installation électrique"],
  "Plomberie": ["plomberie", "plombier", "sanitaire"],
  "Maçonnerie": ["maçonnerie", "maçon", "construction"],
  "Peinture": ["peinture", "peintre", "revêtement"],
  "Carrelage": ["carrelage", "carreleur", "faïence"]
};

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6300/api";

export const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const sortProfessionals = (professionals: Professional[]): Professional[] => {
  return professionals.sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    
    if (a.isNearby && !b.isNearby) return -1;
    if (!a.isNearby && b.isNearby) return 1;
    
    return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
  });
};

export const getAvatarUrl = (pro: Professional) => {
  if (pro.companyLink && pro.companyLink.startsWith("http")) {
    try {
      const url = new URL(pro.companyLink);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    } catch {
      return "/placeholder-user.jpg";
    }
  }
  return "/placeholder-user.jpg";
};

export const buildSearchParams = (query: string, filters: any = {}) => {
  const params = new URLSearchParams();
  
  if (query.trim()) {
    params.append('q', query.trim());
  }
  
  if (filters.code_postal) {
    params.append('code_postal', filters.code_postal);
  }
  
  if (filters.commune) {
    params.append('commune', filters.commune);
  }
  
  if (filters.domaine) {
    params.append('domaine', filters.domaine);
  }
  
  if (filters.siret) {
    params.append('siret', filters.siret);
  }
  
  params.append('size', (filters.size || RGE_API_CONFIG.defaultSize).toString());
  params.append('start', (filters.start || 0).toString());
  
  return params;
};

// Nouvelle liste complète des domaines RGE (libellés officiels)
export const RGE_DOMAIN_LIST: string[] = [
  "Architecte",
  "Audit énergétique Logement collectif",
  "Audit énergétique Maison individuelle",
  "Chaudière bois",
  "Chaudière condensation ou micro-cogénération gaz ou fioul",
  "Chauffage et/ou eau chaude solaire",
  "Chauffe-Eau Thermodynamique",
  "Commisionnement",
  "Etude ACV",
  "Etude bois énergie",
  "Etude eclairage",
  "Etude enveloppe du bâtiment",
  "Etude forage géothermique",
  "Etude solaire photovoltaïque",
  "Etude solaire thermique",
  "Etude système technique bâtiment",
  "Etude thermique reglementaire",
  "Fenêtres de toit",
  "Fenêtres, volets, portes donnant sur l'extérieur",
  "Isolation des combles perdus",
  "Isolation des murs par l'extérieur",
  "Isolation des planchers bas",
  "Isolation des toitures terrasses ou des toitures par l'extérieur",
  "Isolation par l'intérieur des murs ou rampants de toitures ou plafonds",
  "Panneaux solaires photovoltaïques",
  "Poêle ou insert bois",
  "Pompe à chaleur : chauffage",
  "Projet complet de rénovation",
  "Radiateurs électriques, dont régulation.",
  "Ventilation mécanique"
];

// Fonction utilitaire pour normaliser les chaînes (minuscule + suppression des accents)
const normalize = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    // Supprime les marques diacritiques (accents)
    .replace(/[\u0300-\u036f]/g, "");

// Liste de mots-vides français à exclure du matching
const STOP_WORDS = new Set([
  "de", "des", "du", "la", "le", "les", "par", "l", "d", "et", "en", "aux", "au"
]);

// Découpe, normalise et retire les mots vides
const tokenize = (str: string): string[] =>
  normalize(str).split(/\s+/).filter((tok) => tok && !STOP_WORDS.has(tok));

// Retourne le domaine officiel le plus pertinent par recouvrement de tokens
const findBestDomainMatch = (terms: string[]): string | null => {
  const termSet = new Set(terms.filter((t) => t && !STOP_WORDS.has(t)));
  let bestDomain: string | null = null;
  let bestScore = 0;

  for (const domain of RGE_DOMAIN_LIST) {
    const domainTokens = tokenize(domain);
    const score = domainTokens.filter((tok) => termSet.has(tok)).length;
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestScore > 0 ? bestDomain : null;
};

export const parseSearchQuery = (query: string) => {
  const originalSearch = query.trim();
  if (!originalSearch) {
    return { searchQuery: "", filters: {} };
  }

  // Normalisation (minuscule + sans accents)
  const normalizedQuery = normalize(originalSearch);
  const searchTerms = normalizedQuery.split(/\s+/);

  const filters: any = {};
  let remainingTerms = [...searchTerms];

  // 1. Détection code postal (5 chiffres consécutifs)
  const postalCodePattern = /\b\d{5}\b/;
  const postalMatch = normalizedQuery.match(postalCodePattern);
  if (postalMatch) {
    filters.code_postal = postalMatch[0];
    remainingTerms = remainingTerms.filter((t) => t !== postalMatch[0]);
  }

  // 2. Détection SIRET (14 chiffres)
  const siretPattern = /\b\d{14}\b/;
  const siretMatch = normalizedQuery.match(siretPattern);
  if (siretMatch) {
    filters.siret = siretMatch[0];
    remainingTerms = remainingTerms.filter((t) => t !== siretMatch[0]);
  }

  // 3. Détection du domaine (on cherche la première correspondance exacte des mots-clés d'un domaine officiel)
  let foundDomain: string | null = null;
  for (const domain of RGE_DOMAIN_LIST) {
    const domainWords = normalize(domain).split(/\s+/);
    const allPresent = domainWords.every((w) => remainingTerms.includes(w));
    if (allPresent) {
      foundDomain = domain;
      // Retirer les mots du domaine des termes restants
      remainingTerms = remainingTerms.filter((t) => !domainWords.includes(t));
      break;
    }
  }

  // Si aucune correspondance exacte, on tente un matching approximatif
  if (!foundDomain) {
    const bestDomain = findBestDomainMatch(remainingTerms);
    if (bestDomain) {
      foundDomain = bestDomain;
      // On retire également ces tokens du reste des termes
      const tokensToRemove = tokenize(bestDomain);
      remainingTerms = remainingTerms.filter((t) => !tokensToRemove.includes(t));
    }
  }

  if (foundDomain) {
    filters.domaine = foundDomain;
  }

  // 4. Tentative de détection de la commune :
  //    S'il reste un ou plusieurs termes non numériques, on les considère comme la ville.
  const communeTerms = remainingTerms.filter((t) => !/\d/.test(t));
  if (communeTerms.length) {
    // On remet les accents à partir de l'original si possible (simple heuristique)
    const originalTokens = originalSearch.split(/\s+/);
    const guessedCommune = originalTokens
      .filter((tok) => communeTerms.includes(normalize(tok)))
      .join(" ");

    if (guessedCommune) {
      filters.commune = guessedCommune;
    }
  }

  // 5. Le reste des termes sert pour la recherche pleine-texte `q`
  const searchQuery = remainingTerms.join(" ");

  return {
    searchQuery: searchQuery.trim(),
    filters
  };
};

export const mapApiResponseToProfessional = (d: any, idx: number): Professional | null => {
  // Nous exigeons seulement un moyen de contact (email ou téléphone)
  const hasEmail = d.email && d.email.trim() !== "";
  const hasPhone = d.telephone && d.telephone.trim() !== "";

  if (!hasEmail && !hasPhone) {
    return null;
  }

  return {
    id: Date.now() + Math.random() + idx,
    name: d.nom_entreprise ?? d.raison_sociale ?? d.nom ?? "Entreprise non renseignée",
    role: d.domaine ?? "Artisan",
    city: d.code_postal && d.commune ? `${d.code_postal} ${d.commune}` : "Localisation non renseignée",
    avatar: "/placeholder-user.jpg",
    badge: "Entreprise RGE",
    badgeType: "rge",
    skills: d.nom_qualification ? [d.nom_qualification] : [],
    phone: d.telephone ?? "",
    email: d.email ?? "",
    company: d.nom_entreprise ?? d.raison_sociale ?? "",
    companyLink: d.site_internet || "", // peut être vide ou non sécurisé, on l'accepte
    location: d.code_postal && d.commune ? `${d.code_postal} ${d.commune}` : "",
    isNearby: false,
    isVerified: true,
    siret: d.siret,
    adresse: d.adresse,
  };
};

export const handleApiError = (res: Response): never => {
  if (res.status === 429) {
    throw new Error('Limite de requêtes dépassée. Veuillez patienter quelques secondes.');
  } else if (res.status === 404) {
    throw new Error('Aucun résultat trouvé pour cette recherche.');
  } else {
    throw new Error(`Erreur API (${res.status}): ${res.statusText}`);
  }
};

// Constantes pour l'interface
export const REGIONS = [
  { value: "75", label: "Île-de-France" },
  { value: "13", label: "Provence-Alpes-Côte d'Azur" },
  { value: "69", label: "Auvergne-Rhône-Alpes" },
  { value: "31", label: "Occitanie" },
  { value: "44", label: "Grand Est" },
  { value: "32", label: "Hauts-de-France" },
  { value: "52", label: "Pays de la Loire" },
  { value: "24", label: "Centre-Val de Loire" },
  { value: "27", label: "Bourgogne-Franche-Comté" },
  { value: "28", label: "Normandie" },
  { value: "53", label: "Bretagne" },
  { value: "75", label: "Nouvelle-Aquitaine" },
  { value: "84", label: "Corse" },
];

export const FILTER_OPTIONS = [
  "Électricien",
  "Plombier", 
  "Chauffagiste",
  "Isolation",
  "Menuisier",
  "Maçon",
  "Peintre",
  "Carreleur"
];

// Fonctions utilitaires pour les icônes
export const getDomainIcon = (pro: Professional) => {
  const d = pro.role.toLowerCase();
  if (d.includes("électricien") || d.includes("électricité")) return "Zap";
  if (d.includes("plombier") || d.includes("plomberie")) return "Droplet";
  if (d.includes("chauffagiste") || d.includes("chauffage") || d.includes("pompe à chaleur")) return "Flame";
  if (d.includes("ventilation") || d.includes("ventilateur")) return "Fan";
  if (d.includes("isolation des murs") || d.includes("mur extérieur")) return "BrickWall";
  if (d.includes("isolation")) return "Shield";
  if (d.includes("menuisier") || d.includes("menuiserie")) return "Hammer";
  if (d.includes("maçon") || d.includes("maçonnerie")) return "Grid";
  if (d.includes("peintre") || d.includes("peinture")) return "Paintbrush";
  if (d.includes("carreleur") || d.includes("carrelage")) return "Wrench";
  return "Wrench";
};

// Fonctions de recherche et filtrage
export const filterProfessionals = (
  professionals: Professional[],
  search: string,
  showNearbyOnly: boolean,
  activeFilters: string[]
): Professional[] => {
  return professionals.filter((pro) => {
    const matchesSearch = pro.role.toLowerCase().includes(search.toLowerCase()) ||
                         pro.name.toLowerCase().includes(search.toLowerCase());
    const matchesNearby = !showNearbyOnly || pro.isNearby;
    const matchesFilters = activeFilters.length === 0 ||
                          activeFilters.some(filter =>
                            pro.role.toLowerCase().includes(filter.toLowerCase()) ||
                            pro.skills.some(skill => skill.toLowerCase().includes(filter.toLowerCase()))
                          );
    return matchesSearch && matchesNearby && matchesFilters;
  });
};

// Fonctions de chargement des données
export const loadSearchResults = async (
  query: string,
  selectedDomain: string,
  afterCursor: string | null = null,
  append: boolean = false,
  setSearchResults: (results: Professional[] | ((prev: Professional[]) => Professional[])) => void,
  setHasMoreData: (hasMore: boolean) => void,
  setSearchError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  setNextCursor: (cursor: string | null) => void
) => {
  if (!query) {
    setSearchResults([]);
    setSearchError(null);
    return;
  }
  
  setIsLoading(true);
  setSearchError(null);
  
  try {
    const { searchQuery, filters } = parseSearchQuery(query);
    const urlParams = new URLSearchParams();
    urlParams.append("q", searchQuery || query);
    if (selectedDomain !== "all" && selectedDomain) urlParams.append("domaine", selectedDomain);
    Object.entries(filters).forEach(([k, v]) => urlParams.append(k, String(v)));
    if (afterCursor) {
      urlParams.append("after", afterCursor);
    } else {
      urlParams.append("start", "0");
    }
    urlParams.append("size", String(RGE_API_CONFIG.defaultSize));

    const url = `${API_BASE}/rge/search?${urlParams.toString()}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      handleApiError(res);
    }
    
    const json = await res.json();

    if (!json.results || !Array.isArray(json.results)) {
      throw new Error('Format de réponse invalide');
    }

    const fetchedProfessionals: Professional[] = sortProfessionals(
      dedupeProfessionals(
        json.results
          .map(mapApiResponseToProfessional)
          .filter((pro: Professional | null): pro is Professional => pro !== null)
      )
    );

    if (append) {
      setSearchResults((prev) => {
        const combined = [...prev, ...fetchedProfessionals];
        const deduped = dedupeProfessionals(combined);
        console.log(`Page ${afterCursor}: Ajout de ${fetchedProfessionals.length} résultats, total: ${deduped.length}`);
        
        if (deduped.length === prev.length && fetchedProfessionals.length > 0) {
          console.log('Aucun nouveau résultat unique, fin des données atteinte');
          setHasMoreData(false);
        }
        
        return sortProfessionals(deduped);
      });
    } else {
      setSearchResults(fetchedProfessionals);
    }

    if (json.results.length === 0 || json.results.length < RGE_API_CONFIG.defaultSize) {
      console.log(`Fin des données détectée: ${json.results.length} résultats reçus (moins que ${RGE_API_CONFIG.defaultSize})`);
      setHasMoreData(false);
    }

    const nextUrl: string | undefined = json.next;
    if (nextUrl) {
      try {
        const parsed = new URL(nextUrl);
        const afterToken = parsed.searchParams.get("after");
        setNextCursor(afterToken);
      } catch {
        setNextCursor(null);
      }
    } else {
      setNextCursor(null);
    }
  } catch (e) {
    console.error('Erreur lors de la recherche RGE:', e);
    setSearchError(e instanceof Error ? e.message : 'Erreur inconnue lors de la recherche');
    if (!append) {
      setSearchResults([]);
    }
  } finally {
    setIsLoading(false);
  }
};

export const loadProfessionals = async (
  page: number = 1,
  append: boolean = false,
  setProfessionals: (pros: Professional[] | ((prev: Professional[]) => Professional[])) => void,
  setHasMoreData: (hasMore: boolean) => void,
  setSearchError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  setSearchError(null);
  
  try {
    const sizePerTrade = Math.ceil(RGE_API_CONFIG.defaultSize / TRADES.length);
    const results = await Promise.all(
      TRADES.map(async (trade) => {
        try {
          const searchParams = buildSearchParams(trade, {
            size: sizePerTrade,
            start: (page - 1) * sizePerTrade
          });
          
          const url = `${RGE_API_CONFIG.baseUrl}?${searchParams.toString()}`;
          const res = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Omnicity-App/1.0'
            }
          });
          
          if (!res.ok) {
            console.warn(`Erreur pour le métier ${trade}:`, res.status);
            return [];
          }
          
          const json = await res.json();
          return json.results
            ?.map(mapApiResponseToProfessional)
            .filter((pro: Professional | null): pro is Professional => pro !== null) || [];
        } catch (e) {
          console.error(`Erreur pour le métier ${trade}:`, e);
          return [];
        }
      })
    );

    const newProfessionals: Professional[] = sortProfessionals(
      dedupeProfessionals(results.flat())
    );

    if (append) {
      setProfessionals((prev) => sortProfessionals(dedupeProfessionals([...prev, ...newProfessionals])));
    } else {
      setProfessionals(newProfessionals);
    }

    if (results.flat().length === 0 || results.flat().length < RGE_API_CONFIG.defaultSize) {
      setHasMoreData(false);
    }
  } catch (e) {
    console.error('Erreur lors du chargement des professionnels:', e);
    setSearchError('Erreur lors du chargement des professionnels');
  } finally {
    setIsLoading(false);
  }
};

export const loadProQualifications = async (
  pro: Professional,
  setProQualifications: (quals: string[]) => void,
  setIsDialogLoading: (loading: boolean) => void
) => {
  setIsDialogLoading(true);
  
  try {
    if (!pro.siret) {
      setProQualifications([]);
      return;
    }
    
    const searchParams = buildSearchParams('', { siret: pro.siret });
    const url = `${RGE_API_CONFIG.baseUrl}?${searchParams.toString()}`;
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Omnicity-App/1.0'
      }
    });
    
    if (res.ok) {
      const json = await res.json();
      const qualifications = json.results
        ?.map((d: any) => d.nom_qualification)
        .filter(Boolean) || [];
      setProQualifications(Array.from(new Set(qualifications)));
    } else {
      setProQualifications([]);
    }
  } catch (e) {
    console.error('Erreur lors du chargement des qualifications:', e);
    setProQualifications([]);
  } finally {
    setIsDialogLoading(false);
  }
};

// Fonctions de gestion des filtres
export const generateRandomFilters = () => {
  return FILTER_OPTIONS
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
};

// Fonctions de gestion du scroll (générique pour toutes les listes)
export const handleInfiniteScroll = (
  isLoading: boolean,
  hasMoreData: boolean,
  loadMore: () => void
) => {
  if (isLoading || !hasMoreData) return;
  
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  if (scrollTop + windowHeight >= documentHeight - 100) {
    loadMore();
  }
};

export const dedupeProfessionals = (pros: Professional[]): Professional[] => {
  const seen = new Set<string>();
  return pros.filter((pro) => {
    const key = pro.siret || `${pro.name}-${pro.city}-${pro.company}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
