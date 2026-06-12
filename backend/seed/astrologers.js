const dummyAstrologers = [
  {
    name: "Acharya Dev Sharma",
    email: "dev.sharma@astro.local",
    password: "astro123",
    role: "astrologer",
    specialization: "Vedic Astrology",
    experience: 12,
    hourlyRate: 700,
    bio: "Expert in kundli reading, career guidance, and marriage compatibility.",
    rating: 4.8,
    languages: ["Hindi", "English"],
    available: true
  },
  {
    name: "Pandit Raghav Joshi",
    email: "raghav.joshi@astro.local",
    password: "astro123",
    role: "astrologer",
    specialization: "Numerology",
    experience: 9,
    hourlyRate: 550,
    bio: "Helps users with name correction, lucky numbers, and business timing.",
    rating: 4.6,
    languages: ["Hindi"],
    available: true
  },
  {
    name: "Dr. Meera Trivedi",
    email: "meera.trivedi@astro.local",
    password: "astro123",
    role: "astrologer",
    specialization: "Tarot & Love Guidance",
    experience: 7,
    hourlyRate: 650,
    bio: "Specializes in relationship clarity, tarot readings, and emotional healing.",
    rating: 4.7,
    languages: ["Hindi", "English"],
    available: true
  },
  {
    name: "Guru Anant Verma",
    email: "anant.verma@astro.local",
    password: "astro123",
    role: "astrologer",
    specialization: "Palmistry",
    experience: 15,
    hourlyRate: 800,
    bio: "Senior palmistry consultant for life path, finance, and health insights.",
    rating: 4.9,
    languages: ["Hindi", "Punjabi"],
    available: true
  }
];

export const seedAstrologers = async (User) => {
  for (const astrologer of dummyAstrologers) {
    const exists = await User.exists({ email: astrologer.email });

    if (!exists) {
      await User.create(astrologer);
    }
  }
};
