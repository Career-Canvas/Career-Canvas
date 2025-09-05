// Hardcoded university and course data for the MVP

export interface Course {
  courseName: string;
  requiredAPS: number;
  requiredSubjects: string[];
  personalityType: string[];
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
        id: "Je-CCEvaZW8",
        title: "Wits Campus Tour - A Complete Walkthrough",
        type: "Campus Tour"
      },
      {
        id: "DQ_ncxrtGNQ",
        title: "Day in the Life of a Wits Student",
        type: "Student Vlog"
      },
      {
        id: "PKz7cxsx9v0",
        title: "Why Wits",
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
        id: "UmVaJmReSdE",
        title: "UJ Campus Tour",
        type: "Campus Tour"
      },
      {
        id: "0f3vp54EpTA",
        title: "Why I Chose UJ",
        type: "Student Vlog"
      },
      {
        id: "ToKt8urukYQ",
        title: "Things I Wish I Knew Before Coming to Uni | UJ Edition",
        type: "Faculty Focus"
      }
    ]
  },
  {
    name: "University of Pretoria",
    shortName: "UP",
    description: "A leading research-intensive university in South Africa, known for excellence in agriculture, engineering, and health sciences.",
    campusTips: [
      "🌿 Hatfield campus is beautiful with lots of green spaces - perfect for studying outdoors!",
      "🚌 UP buses run frequently between campuses - download the UP mobile app for schedules",
      "☕ The Student Centre has great coffee and food options - avoid the long queues during peak hours",
      "🎵 UP has amazing cultural events and the music department performances are world-class"
    ],
    videos: [
      {
        id: "zICWqLlrWuc",
        title: "UP Virtual Campus Tour",
        type: "Campus Tour"
      },
      {
        id: "IlswqElOyBU",
        title: "Uni Diaries - First Week of UP",
        type: "Student Vlog"
      },
      {
        id: "2CAw1-_6Uxc",
        title: "Future Africa | UP",
        type: "Faculty Focus"
      }
    ]
  }
];

export const courses: Course[] = [
  // Wits Courses
  {
    "courseName": "BSc Computer Science",
    "requiredAPS": 42,
    "requiredSubjects": ["Mathematics", "Physical Science"],
    "personalityType": ["INTP", "INTJ", "ENTP", "ESTJ", "ISTJ"],
    "personalityGroup": "Analytical",
    "brainInfo": "A rigorous program covering algorithms, data structures, software engineering, and artificial intelligence. Strong emphasis on mathematical foundations and problem-solving. Graduates are highly sought after in tech industry with excellent career prospects in software development, research, and innovation.",
    "heartInfo": "The CS community at Wits is tight-knit and collaborative. Late nights in the lab become legendary memories. The annual Wits CS hackathon is a highlight - amazing prizes and networking opportunities!",
    "university": "Wits",
    "duration": "3 years",
    "intake": "February"
  },
  {
    "courseName": "BSc Actuarial Science",
    "requiredAPS": 42,
    "requiredSubjects": ["English Home Language", "Mathematics", "Physical Science"],
    "personalityType": ["INTP", "ISTJ", "ENTJ"],
    "personalityGroup": "Analytical",
    "brainInfo": "A very rigorous 3-year degree focused on the application of mathematical and statistical skills to complex financial problems. The curriculum is highly technical, covering advanced topics like financial mathematics, risk modeling, and stochastic processes. The program is designed to provide you with exemptions from the Actuarial Society of South Africa (ASSA) professional exams.",
    "heartInfo": "The Actuarial Science program has a reputation for being one of the most challenging, but it fosters a tight-knit community of dedicated students. There is a strong culture of peer-to-peer tutoring and group study sessions. You will be part of a competitive, supportive environment that is well-connected with the financial and insurance industries.",
    "university": "Wits",
    "duration": "3 years",
    "intake": "February"
  },
  {
    "courseName": "BCom Accounting",
    "requiredAPS": 35,
    "requiredSubjects": ["Mathematics", "Accounting"],
    "personalityType": ["ISTJ", "ESTJ", "INTP"],
    "personalityGroup": "Practical",
    "brainInfo": "Comprehensive training in financial and management accounting, auditing, taxation, and business law. Strong focus on professional qualification preparation (SAICA, SAIPA). Excellent pass rates for professional exams and strong industry partnerships.",
    "heartInfo": "The accounting students have a great study culture - group sessions during exam time are lifesavers. The Wits Accounting Society organizes amazing industry networking events. Plus, the job market is solid!",
    "university": "Wits",
    "duration": "3 years",
    "intake": "February"
  },
  {
    "courseName": "BA Psychology",
    "requiredAPS": 32,
    "requiredSubjects": ["English", "Life Sciences"],
    "personalityType": ["INFJ", "INFP", "ENFJ", "ISFJ"],
    "personalityGroup": "Social",
    "brainInfo": "Explores human behavior, cognition, and mental processes through scientific research methods. Covers developmental, social, cognitive, and abnormal psychology. Strong foundation for further study in clinical, counseling, or research psychology.",
    "heartInfo": "Psychology students are the most empathetic bunch on campus! The department feels like a family. Practical sessions and case studies make the theory come alive. Mental Health Week is always eye-opening.",
    "university": "Wits",
    "duration": "3 years",
    "intake": "February"
  },
  {
    "courseName": "Bachelor of Architecture",
    "requiredAPS": 38,
    "requiredSubjects": ["Mathematics", "Physical Science", "Art"],
    "personalityType": ["INTJ", "INTP", "ISTP", "ISFP"],
    "personalityGroup": "Creative",
    "brainInfo": "Intensive 5-year professional program combining design theory, technical knowledge, and practical skills. Covers architectural history, building technology, environmental design, and urban planning. Studio-based learning with real client projects.",
    "heartInfo": "Architecture school is intense but incredibly fulfilling. You'll live in the studio during crits, but the creative energy is addictive. The Wits architecture building itself is inspiring, and the community is tight-knit.",
    "university": "Wits",
    "duration": "5 years",
    "intake": "February"
  },
  {
    "courseName": "BSc Engineering (Mechanical)",
    "requiredAPS": 45,
    "requiredSubjects": ["Mathematics", "Physical Science"],
    "personalityType": ["ISTP", "INTP", "INTJ", "ENTJ"],
    "personalityGroup": "Practical",
    "brainInfo": "Comprehensive engineering education covering mechanics, thermodynamics, materials science, and design. Strong emphasis on practical problem-solving and innovation. Excellent industry connections and internship opportunities with leading engineering firms.",
    "heartInfo": "Engineering at Wits is tough but the camaraderie gets you through. Study groups in the engineering library become your second family. The annual engineering week competitions are legendary!",
    "university": "Wits",
    "duration": "4 years",
    "intake": "February"
  },
  // UJ Courses
  {
    "courseName": "BSc Information Technology",
    "requiredAPS": 30,
    "requiredSubjects": ["Mathematics", "Physical Science"],
    "personalityType": ["INTP", "ISTP", "INTJ", "ENTP", "ISTJ"],
    "personalityGroup": "Analytical",
    "brainInfo": "Modern IT program focusing on software development, database systems, networking, and cybersecurity. Strong industry partnerships provide real-world experience through internships and projects. Emphasis on emerging technologies like AI and cloud computing.",
    "heartInfo": "UJ IT students are incredibly innovative! The department has a maker culture - hackathons, coding competitions, and tech meetups happen regularly. The computer labs are open 24/7 during project weeks.",
    "university": "UJ",
    "duration": "3 years",
    "intake": "February & July"
  },
  {
    "courseName": "BCom Marketing Management",
    "requiredAPS": 28,
    "requiredSubjects": ["Mathematics", "English"],
    "personalityType": ["ENFP", "ENTP", "ESTP", "ESFP"],
    "personalityGroup": "Creative",
    "brainInfo": "Dynamic program covering consumer behavior, digital marketing, brand management, and market research. Strong focus on practical application through live client projects and internships. Prepares students for careers in advertising, brand management, and digital marketing.",
    "heartInfo": "Marketing students know how to have fun while learning! Project presentations are like mini advertising pitches. The UJ Marketing Society hosts amazing industry events with big agencies.",
    "university": "UJ",
    "duration": "3 years",
    "intake": "February & July"
  },
  {
    "courseName": "BA Social Work",
    "requiredAPS": 26,
    "requiredSubjects": ["English", "Life Sciences"],
    "personalityType": ["ISFJ", "ESFJ", "INFJ", "ENFJ"],
    "personalityGroup": "Social",
    "brainInfo": "Professional program preparing students for social work practice in diverse settings. Covers human development, social policy, research methods, and intervention techniques. Strong fieldwork component with supervised practical training in communities.",
    "heartInfo": "Social work students are passionate change-makers! The fieldwork experiences are eye-opening and transformative. The support network among students and lecturers is incredible - like a caring family.",
    "university": "UJ",
    "duration": "4 years",
    "intake": "February"
  },
  {
    "courseName": "National Diploma: Fashion Design",
    "requiredAPS": 24,
    "requiredSubjects": ["Art", "English"],
    "personalityType": ["ISFP", "INFP", "ESFP", "ENFP"],
    "personalityGroup": "Creative",
    "brainInfo": "Comprehensive fashion design program covering design principles, pattern making, garment construction, and fashion illustration. Includes textile science, fashion business, and trend forecasting. Students create complete collections for annual fashion shows.",
    "heartInfo": "Fashion design at UJ is like Project Runway every day! The studios buzz with creativity. Fashion week is the highlight - seeing your designs on the runway is indescribable. The fashion community is super supportive.",
    "university": "UJ",
    "duration": "3 years",
    "intake": "February"
  },
  {
    "courseName": "BCom Economics and Econometrics",
    "requiredAPS": 35,
    "requiredSubjects": ["Mathematics", "English"],
    "personalityType": ["ENTJ", "INTJ", "ENTP", "INTP"],
    "personalityGroup": "Analytical",
    "brainInfo": "Rigorous program combining economic theory with statistical analysis and quantitative methods. Covers microeconomics, macroeconomics, econometrics, and financial economics. Strong analytical training for careers in banking, consulting, and policy analysis.",
    "heartInfo": "Economics students are the critical thinkers of campus! Debates in class get heated but respectful. The department has great connections with the Reserve Bank and major consulting firms for internships.",
    "university": "UJ",
    "duration": "3 years",
    "intake": "February"
  },
  // UP Courses
  {
    "courseName": "BSc Computer Science",
    "requiredAPS": 42,
    "requiredSubjects": ["Mathematics", "Physical Science"],
    "personalityType": ["INTJ", "INTP", "ENTP", "ISTJ"],
    "personalityGroup": "Analytical",
    "brainInfo": "Comprehensive computer science program with strong focus on software engineering, artificial intelligence, and data science. UP's CS department is known for practical applications and industry partnerships. Excellent facilities and research opportunities in emerging technologies.",
    "heartInfo": "UP CS students are innovative and collaborative! The department has a great maker culture with regular hackathons and coding competitions. The computer labs are modern and well-equipped, and the community is very supportive.",
    "university": "UP",
    "duration": "3 years",
    "intake": "February"
  },
  {
    "courseName": "MBChB Medicine",
    "requiredAPS": 44,
    "requiredSubjects": ["Mathematics", "Physical Science", "Life Sciences"],
    "personalityType": ["ISFJ", "ESFJ", "INFJ", "ENTJ"],
    "personalityGroup": "Social",
    "brainInfo": "Leading medical program with state-of-the-art facilities and strong clinical training. Six-year program including rotations at Steve Biko Academic Hospital. Known for research excellence in tropical medicine and public health.",
    "heartInfo": "UP med school fosters a supportive learning environment with excellent mentorship programs. The clinical rotations provide diverse experiences, and the annual med ball is a highlight of the social calendar!",
    "university": "UP",
    "duration": "6 years",
    "intake": "February"
  },
  {
    "courseName": "BSc Agriculture",
    "requiredAPS": 38,
    "requiredSubjects": ["Mathematics", "Life Sciences"],
    "personalityType": ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    "personalityGroup": "Practical",
    "brainInfo": "Comprehensive agriculture program covering crop science, animal science, and agricultural economics. UP is renowned for agricultural research and innovation. Strong industry connections and practical training on the university's experimental farms.",
    "heartInfo": "Agriculture students at UP love the hands-on experience! Field trips to farms and research stations are amazing. The department has a great community feel, and the annual agricultural show is a highlight.",
    "university": "UP",
    "duration": "4 years",
    "intake": "February"
  },
  {
    "courseName": "BSc Engineering (Mechanical)",
    "requiredAPS": 43,
    "requiredSubjects": ["Mathematics", "Physical Science"],
    "personalityType": ["ISTP", "INTP", "INTJ", "ENTJ"],
    "personalityGroup": "Practical",
    "brainInfo": "Strong mechanical engineering program with focus on design, manufacturing, and automation. UP's engineering faculty has excellent industry partnerships and modern laboratories. Emphasis on practical problem-solving and innovation.",
    "heartInfo": "Mechanical engineering at UP is challenging but rewarding! The workshops are well-equipped, and students work on real industry projects. The annual engineering week showcases amazing student innovations.",
    "university": "UP",
    "duration": "4 years",
    "intake": "February"
  },
  {
    "courseName": "BCom Accounting",
    "requiredAPS": 36,
    "requiredSubjects": ["Mathematics", "Accounting"],
    "personalityType": ["ISTJ", "ESTJ", "INTP"],
    "personalityGroup": "Practical",
    "brainInfo": "Comprehensive accounting program with strong focus on financial reporting, auditing, and taxation. UP's accounting department has excellent pass rates for professional exams and strong industry connections.",
    "heartInfo": "UP accounting students are dedicated and supportive! Study groups are very effective, and the department organizes great networking events with major accounting firms.",
    "university": "UP",
    "duration": "3 years",
    "intake": "February"
  }
];