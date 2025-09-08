import type { MaramatakaPhase } from '../types';
import { FishingRating } from '../types';

export const MARAMATAKA_PHASES: MaramatakaPhase[] = [
  {
    name: "Whiro",
    quality: FishingRating.Poor,
    description: "The new moon. An unfavourable day for fishing and planting. Energy is low.",
    biteQualities: ["poor", "poor", "poor", "poor"]
  },
  {
    name: "Tirea",
    quality: FishingRating.Poor,
    description: "The first day of the waxing moon. Still a low-energy day, fishing remains poor.",
    biteQualities: ["poor", "poor", "poor", "average"]
  },
  {
    name: "Hoata",
    quality: FishingRating.Average,
    description: "The moon is growing. A better day for fishing as activity begins to increase.",
    biteQualities: ["average", "poor", "good", "average"]
  },
  {
    name: "Oue",
    quality: FishingRating.Good,
    description: "A productive day for fishing and planting. Marine life becomes more active.",
    biteQualities: ["good", "average", "good", "good"]
  },
  {
    name: "Okoro",
    quality: FishingRating.Average,
    description: "A reasonably good day, especially for fishing in the morning.",
    biteQualities: ["average", "average", "good", "average"]
  },
  {
    name: "Tamatea-a-ngana",
    quality: FishingRating.Average,
    description: "The first of the 'Tamatea' variable days. Can be unpredictable.",
    biteQualities: ["average", "poor", "average", "poor"]
  },
  {
    name: "Tamatea-a-hotu",
    quality: FishingRating.Poor,
    description: "A temperamental day with strong winds and rough seas often noted.",
    biteQualities: ["poor", "poor", "average", "poor"]
  },
  {
    name: "Tamatea-a-io",
    quality: FishingRating.Average,
    description: "The weather may start to calm. Fishing can pick up in sheltered areas.",
    biteQualities: ["average", "good", "poor", "average"]
  },
  {
    name: "Tamatea-kai-ariki",
    quality: FishingRating.Good,
    description: "A much calmer and more favourable day for fishing.",
    biteQualities: ["good", "average", "good", "average"]
  },
  {
    name: "Huna",
    quality: FishingRating.Poor,
    description: "'Huna' means hidden. Fish are harder to find and less likely to bite.",
    biteQualities: ["poor", "poor", "poor", "poor"]
  },
  {
    name: "Ari",
    quality: FishingRating.Good,
    description: "A promising day. Good for all types of fishing as the moon nears fullness.",
    biteQualities: ["good", "average", "good", "good"]
  },
  {
    name: "Maure",
    quality: FishingRating.Good,
    description: "Another productive day, with high energy leading up to the full moon.",
    biteQualities: ["good", "good", "average", "good"]
  },
  {
    name: "Mawharu",
    quality: FishingRating.Excellent,
    description: "An excellent day for fishing, often with calm weather. High activity.",
    biteQualities: ["excellent", "good", "good", "average"]
  },
  {
    name: "Atua",
    quality: FishingRating.Average,
    description: "The day before the full moon. Can be good but sometimes unpredictable.",
    biteQualities: ["average", "good", "average", "average"]
  },
  {
    name: "Ohotu",
    quality: FishingRating.Good,
    description: "A favourable day. Fish are feeding actively.",
    biteQualities: ["good", "average", "good", "good"]
  },
  {
    name: "Rakau-nui",
    quality: FishingRating.Excellent,
    description: "The full moon. One of the best days for fishing, especially at night.",
    biteQualities: ["excellent", "excellent", "good", "good"]
  },
  {
    name: "Rakau-matohi",
    quality: FishingRating.Excellent,
    description: "The day after the full moon. Still an excellent time for fishing as activity remains high.",
    biteQualities: ["excellent", "excellent", "good", "average"]
  },
  {
    name: "Takirau",
    quality: FishingRating.Good,
    description: "A very good day for fishing as the moon begins to wane.",
    biteQualities: ["good", "good", "excellent", "good"]
  },
  {
    name: "Oike",
    quality: FishingRating.Average,
    description: "A day of moderate success. The evening bite can be particularly good.",
    biteQualities: ["average", "good", "average", "good"]
  },
  {
    name: "Korekore-te-whiwhia",
    quality: FishingRating.Poor,
    description: "The first of the 'Korekore' (no harvest) days. Fishing is generally poor.",
    biteQualities: ["poor", "average", "poor", "poor"]
  },
  {
    name: "Korekore-te-rawea",
    quality: FishingRating.Poor,
    description: "Another challenging day. It's better to rest and prepare gear.",
    biteQualities: ["poor", "poor", "average", "poor"]
  },
  {
    name: "Korekore-piri-ki-te-Tangaroa",
    quality: FishingRating.Average,
    description: "The last Korekore day, leading into the Tangaroa phase. Activity starts to build.",
    biteQualities: ["average", "poor", "good", "average"]
  },
  {
    name: "Tangaroa-a-mua",
    quality: FishingRating.Excellent,
    description: "An excellent fishing day. The tides are strong, and fish are feeding heavily.",
    biteQualities: ["excellent", "good", "excellent", "good"]
  },
  {
    name: "Tangaroa-a-roto",
    quality: FishingRating.Excellent,
    description: "Another top-tier fishing day. All forms of fishing are highly favoured.",
    biteQualities: ["excellent", "good", "excellent", "excellent"]
  },
  {
    name: "Tangaroa-kiokio",
    quality: FishingRating.Good,
    description: "A very good day for fishing, though energy may be slightly less than the previous two days.",
    biteQualities: ["good", "excellent", "good", "good"]
  },
  {
    name: "Otaane",
    quality: FishingRating.Good,
    description: "A good day for fishing, especially in forests and rivers.",
    biteQualities: ["good", "average", "good", "average"]
  },
  {
    name: "Orongonui",
    quality: FishingRating.Excellent,
    description: "A final excellent day before the moon disappears. A great time for night fishing.",
    biteQualities: ["excellent", "good", "good", "good"]
  },
  {
    name: "Mauri",
    quality: FishingRating.Average,
    description: "Energy is starting to wane. Fishing is best done early in the day.",
    biteQualities: ["average", "poor", "good", "poor"]
  },
  {
    name: "Omutu",
    quality: FishingRating.Poor,
    description: "A low-energy day. Fishing is not recommended.",
    biteQualities: ["poor", "poor", "average", "poor"]
  },
  {
    name: "Mutuwhenua",
    quality: FishingRating.Poor,
    description: "The 'day of death'. The darkest night, unfavourable for fishing.",
    biteQualities: ["poor", "poor", "poor", "poor"]
  }
];
