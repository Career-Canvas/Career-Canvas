// Hardcoded university and course data for the MVP

export interface Course {
  courseName: string;
  requiredAPS: number;
  requiredSubjects: string[];
  personalityType: string;
  personalityGroup: string; // New field for broad category
  brainInfo: string;
  heartInfo: string;
  university: string;
  duration: string;
  intake: string;
}

export interface UniversityVideo {
  id: string;
  title: string;
  type: "Campus Tour" | "Student Vlog" | "Faculty Focus";
}

export interface UniversityInfo {
  name: string;
  shortName: string;
  description: string;
  campusTips: string[];
  videos: UniversityVideo[];
}

export const universities: UniversityInfo[] = [
  {
    name: "University of the Witwatersrand",
    shortName: "Wits",
    description: "A leading research-intensive university in Africa, known for excellence in mining, engineering, and social sciences.",
    campusTips: [
      "🚗 Parking is on East Campus - prepare for a 15-minute walk to West Campus!",
      "📚 The Central Block Library gets packed during exams - arrive early or try the Education Library",
      "🍕 Nandos in Matrix is always busy, try the food trucks near the Great Hall for quicker meals",
      "🏃‍♂️ Download the Wits app for campus maps - you'll get lost without it in your first week!"
    ],
    videos: [
      {
        id: "placeholder-wits-campus-tour",
        title: "Wits Campus Tour - A Complete Walkthrough",
        type: "Campus Tour"
      },
      {
        id: "placeholder-wits-student-vlog",
        title: "A Day in the Life of a Wits Student",
        type: "Student Vlog"
      },
      {
        id: "placeholder-wits-faculty-focus",
        title: "Meet the Engineering Faculty at Wits",
        type: "Faculty Focus"
      }
    ]
  },
  {
    name: "University of Johannesburg",
    shortName: "UJ",
    description: "A vibrant, multicultural university offering world-class academic programs with a focus on practical learning.",
    campusTips: [
      "🚌 The campus shuttle is free and runs every 15 minutes between APK and DFC campuses",
      "📱 UJ WiFi is pretty reliable, but download offline maps for those dead zones",
      "☕ The Kingsway campus has the best coffee at Student Centre - avoid the long lunch queues",
      "🎵 Join a society early! UJ has amazing cultural societies and the music scene is incredible"
    ],
    videos: [
      {
        id: "placeholder-uj-campus-tour",
        title: "UJ Campus Tour - Kingsway to DFC",
        type: "Campus Tour"
      },
      {
        id: "placeholder-uj-student-vlog",
        title: "Student Life at UJ - The Real Experience",
        type: "Student Vlog"
      },
      {
        id: "placeholder-uj-faculty-focus",
        title: "Business Faculty Spotlight at UJ",
        type: "Faculty Focus"
      }
    ]
  },
  {
    name: "University of Cape Town",
    shortName: "UCT",
    description: "Africa's top-ranked university, renowned for research excellence and its stunning location beneath Table Mountain.",
    campusTips: [
      "🌬️ Pack layers! Cape Town weather changes every 5 minutes, especially in winter",
      "🚗 Upper Campus parking fills up by 8 AM - use the Jammie shuttle or cycle up",
      "🍔 Wimpy in Kramer is overpriced, head to Observatory for cheap eats off campus",
      "📖 Jagger Library is beautiful but can be distracting - try Chancellor Oppenheimer for serious studying"
    ],
    videos: [
      {
        id: "placeholder-uct-campus-tour",
        title: "UCT Campus Tour - From Upper to Lower Campus",
        type: "Campus Tour"
      },
      {
        id: "placeholder-uct-student-vlog",
        title: "A Day at UCT - Student Perspective",
        type: "Student Vlog"
      },
      {
        id: "placeholder-uct-faculty-focus",
        title: "Medical Faculty Introduction at UCT",
        type: "Faculty Focus"
      }
    ]
  }
];

export const courses: Course[] = [
  // Wits Courses
  {
    courseName: "BSc Computer Science",
    requiredAPS: 42,
    requiredSubjects: ["Mathematics", "Physical Science"],
    personalityType: "INTP",
    personalityGroup: "Analytical",
    brainInfo: "A rigorous program covering algorithms, data structures, software engineering, and artificial intelligence. Strong emphasis on mathematical foundations and problem-solving. Graduates are highly sought after in tech industry with excellent career prospects in software development, research, and innovation.",
    heartInfo: "The CS community at Wits is tight-knit and collaborative. Late nights in the lab become legendary memories. The annual Wits CS hackathon is a highlight - amazing prizes and networking opportunities!",
    university: "Wits",
    duration: "3 years",
    intake: "February",
  },
  {
    courseName: "BCom Accounting",
    requiredAPS: 35,
    requiredSubjects: ["Mathematics", "Accounting"],
    personalityType: "ISTJ",
    personalityGroup: "Practical",
    brainInfo: "Comprehensive training in financial and management accounting, auditing, taxation, and business law. Strong focus on professional qualification preparation (SAICA, SAIPA). Excellent pass rates for professional exams and strong industry partnerships.",
    heartInfo: "The accounting students have a great study culture - group sessions during exam time are lifesavers. The Wits Accounting Society organizes amazing industry networking events. Plus, the job market is solid!",
    university: "Wits",
    duration: "3 years",
    intake: "February",
  },
  {
    courseName: "BA Psychology",
    requiredAPS: 32,
    requiredSubjects: ["English", "Life Sciences"],
    personalityType: "INFJ",
    personalityGroup: "Social",
    brainInfo: "Explores human behavior, cognition, and mental processes through scientific research methods. Covers developmental, social, cognitive, and abnormal psychology. Strong foundation for further study in clinical, counseling, or research psychology.",
    heartInfo: "Psychology students are the most empathetic bunch on campus! The department feels like a family. Practical sessions and case studies make the theory come alive. Mental Health Week is always eye-opening.",
    university: "Wits",
    duration: "3 years",
    intake: "February",
  },
  {
    courseName: "Bachelor of Architecture",
    requiredAPS: 38,
    requiredSubjects: ["Mathematics", "Physical Science", "Art"],
    personalityType: "INTJ",
    personalityGroup: "Creative",
    brainInfo: "Intensive 5-year professional program combining design theory, technical knowledge, and practical skills. Covers architectural history, building technology, environmental design, and urban planning. Studio-based learning with real client projects.",
    heartInfo: "Architecture school is intense but incredibly fulfilling. You'll live in the studio during crits, but the creative energy is addictive. The Wits architecture building itself is inspiring, and the community is tight-knit.",
    university: "Wits",
    duration: "5 years",
    intake: "February",
  },
  {
    courseName: "BSc Engineering (Mechanical)",
    requiredAPS: 45,
    requiredSubjects: ["Mathematics", "Physical Science"],
    personalityType: "ISTP",
    personalityGroup: "Practical",
    brainInfo: "Comprehensive engineering education covering mechanics, thermodynamics, materials science, and design. Strong emphasis on practical problem-solving and innovation. Excellent industry connections and internship opportunities with leading engineering firms.",
    heartInfo: "Engineering at Wits is tough but the camaraderie gets you through. Study groups in the engineering library become your second family. The annual engineering week competitions are legendary!",
    university: "Wits",
    duration: "4 years",
    intake: "February",
  },

  // UJ Courses
  {
    courseName: "BSc Information Technology",
    requiredAPS: 30,
    requiredSubjects: ["Mathematics", "Physical Science"],
    personalityType: "INTP",
    personalityGroup: "Analytical",
    brainInfo: "Modern IT program focusing on software development, database systems, networking, and cybersecurity. Strong industry partnerships provide real-world experience through internships and projects. Emphasis on emerging technologies like AI and cloud computing.",
    heartInfo: "UJ IT students are incredibly innovative! The department has a maker culture - hackathons, coding competitions, and tech meetups happen regularly. The computer labs are open 24/7 during project weeks.",
    university: "UJ",
    duration: "3 years",
    intake: "February & July",
  },
  {
    courseName: "BCom Marketing Management",
    requiredAPS: 28,
    requiredSubjects: ["Mathematics", "English"],
    personalityType: "ENFP",
    personalityGroup: "Creative",
    brainInfo: "Dynamic program covering consumer behavior, digital marketing, brand management, and market research. Strong focus on practical application through live client projects and internships. Prepares students for careers in advertising, brand management, and digital marketing.",
    heartInfo: "Marketing students know how to have fun while learning! Project presentations are like mini advertising pitches. The UJ Marketing Society hosts amazing industry events with big agencies.",
    university: "UJ",
    duration: "3 years",
    intake: "February & July",
  },
  {
    courseName: "BA Social Work",
    requiredAPS: 26,
    requiredSubjects: ["English", "Life Sciences"],
    personalityType: "ISFJ",
    personalityGroup: "Social",
    brainInfo: "Professional program preparing students for social work practice in diverse settings. Covers human development, social policy, research methods, and intervention techniques. Strong fieldwork component with supervised practical training in communities.",
    heartInfo: "Social work students are passionate change-makers! The fieldwork experiences are eye-opening and transformative. The support network among students and lecturers is incredible - like a caring family.",
    university: "UJ",
    duration: "4 years",
    intake: "February",
  },
  {
    courseName: "National Diploma: Fashion Design",
    requiredAPS: 24,
    requiredSubjects: ["Art", "English"],
    personalityType: "ISFP",
    personalityGroup: "Creative",
    brainInfo: "Comprehensive fashion design program covering design principles, pattern making, garment construction, and fashion illustration. Includes textile science, fashion business, and trend forecasting. Students create complete collections for annual fashion shows.",
    heartInfo: "Fashion design at UJ is like Project Runway every day! The studios buzz with creativity. Fashion week is the highlight - seeing your designs on the runway is indescribable. The fashion community is super supportive.",
    university: "UJ",
    duration: "3 years",
    intake: "February",
  },
  {
    courseName: "BCom Economics and Econometrics",
    requiredAPS: 35,
    requiredSubjects: ["Mathematics", "English"],
    personalityType: "ENTJ",
    personalityGroup: "Analytical",
    brainInfo: "Rigorous program combining economic theory with statistical analysis and quantitative methods. Covers microeconomics, macroeconomics, econometrics, and financial economics. Strong analytical training for careers in banking, consulting, and policy analysis.",
    heartInfo: "Economics students are the critical thinkers of campus! Debates in class get heated but respectful. The department has great connections with the Reserve Bank and major consulting firms for internships.",
    university: "UJ",
    duration: "3 years",
    intake: "February",
  },

  // UCT Courses  
  {
    courseName: "BSc Computer Science",
    requiredAPS: 45,
    requiredSubjects: ["Mathematics", "Physical Science"],
    personalityType: "INTJ",
    personalityGroup: "Analytical",
    brainInfo: "World-class computer science program with cutting-edge research in machine learning, robotics, and quantum computing. Small class sizes allow personalized attention from renowned faculty. Strong emphasis on theoretical foundations and research methodology.",
    heartInfo: "UCT CS is competitive but collaborative. Study groups on the library lawns with Table Mountain views are unbeatable. The annual CS department braai is legendary, and Silicon Cape connections are incredible.",
    university: "UCT",
    duration: "3 years",
    intake: "February",
  },
  {
    courseName: "MBChB Medicine",
    requiredAPS: 46,
    requiredSubjects: ["Mathematics", "Physical Science", "Life Sciences"],
    personalityType: "ISFJ",
    personalityGroup: "Social",
    brainInfo: "Premier medical program in Africa with world-renowned faculty and research facilities. Six-year program including clinical rotations at Groote Schuur Hospital. Strong focus on African health challenges and global health perspectives.",
    heartInfo: "Med school at UCT is incredibly demanding but the friendships formed are lifelong. The Groote Schuur rotations are intimidating but transformative. Med ball is the social event of the year!",
    university: "UCT",
    duration: "6 years",
    intake: "February",
  },
  {
    courseName: "BA Philosophy, Politics and Economics",
    requiredAPS: 40,
    requiredSubjects: ["Mathematics", "English"],
    personalityType: "ENTP",
    personalityGroup: "Analytical",
    brainInfo: "Interdisciplinary program combining philosophy, political science, and economics. Develops critical thinking, analytical reasoning, and understanding of complex social issues. Excellent preparation for law, politics, journalism, and public policy careers.",
    heartInfo: "PPE students are the campus intellectuals who love a good debate! Tutorials in the philosophy department feel like Oxford. The political engagement on campus is inspiring, especially during student elections.",
    university: "UCT",
    duration: "3 years",
    intake: "February",
  },
  {
    courseName: "BSc Engineering (Civil)",
    requiredAPS: 44,
    requiredSubjects: ["Mathematics", "Physical Science"],
    personalityType: "ESTJ",
    personalityGroup: "Practical",
    brainInfo: "Leading civil engineering program with focus on infrastructure development and sustainable design. Covers structural, water, and transportation engineering. Strong industry partnerships and research in African infrastructure challenges.",
    heartInfo: "Civil engineering at UCT has amazing field trips - from dams to bridges across South Africa. The department feels like family, and the job prospects are incredible. Engineering students know how to work hard and play hard!",
    university: "UCT",
    duration: "4 years",
    intake: "February",
  },
  {
    courseName: "BA Fine Arts",
    requiredAPS: 30,
    requiredSubjects: ["Art", "English"],
    personalityType: "ISFP",
    personalityGroup: "Creative",
    brainInfo: "Comprehensive fine arts program covering painting, sculpture, printmaking, and digital media. Strong emphasis on critical theory and art history. Access to professional-grade studios and equipment. Regular exhibitions and guest artist workshops.",
    heartInfo: "Fine Arts at UCT is pure creative freedom! The Michaelis School studios are inspiring spaces where magic happens. Critique sessions are intense but push your boundaries. The end-of-year exhibitions are campus highlights.",
    university: "UCT",
    duration: "3 years",
    intake: "February",
  }
];