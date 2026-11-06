const FIELDS = {
  Engineering: ["CSE","IT","AI/ML","ECE","Mechanical","Civil","Other"],
  Medical: ["MBBS","BDS","Nursing","Pharmacy"],
  Commerce: ["B.Com","Accounting","Finance"],
  Law: ["LLB","BA LLB","Corporate Law"],
  Arts: ["English","History","Fine Arts","Psychology"],
  Science: ["Physics","Chemistry","Biology","Mathematics"],
  Management: ["BBA","MBA","Marketing","HR"]
};
const INTERESTS = ["Internships","Scholarships","Courses","Hackathons","Research","Events","Jobs","Competitions"];
const NEWS = [
 {id:"n1",title:"Open-source LLMs now run on student laptops",field:"Engineering",branch:"AI/ML",cat:"Technology",date:"2026-10-26",summary:"New quantized models let students experiment with AI without cloud credits."},
 {id:"n2",title:"Semiconductor mission opens 5,000 training seats",field:"Engineering",branch:"ECE",cat:"Industry",date:"2026-10-24",summary:"Government-backed chip design program invites ECE students to apply."},
 {id:"n3",title:"Green concrete research wins national award",field:"Engineering",branch:"Civil",cat:"Research",date:"2026-10-20",summary:"Low-carbon cement blend reduces emissions by 40%."},
 {id:"n4",title:"Web frameworks: what recruiters want in 2027",field:"Engineering",branch:"CSE",cat:"Careers",date:"2026-10-25",summary:"React, TypeScript and cloud basics top the skill list."},
 {id:"n5",title:"EV powertrain design course goes free",field:"Engineering",branch:"Mechanical",cat:"Learning",date:"2026-10-18",summary:"Top institute releases full EV course videos online."},
 {id:"n6",title:"NEET PG exam pattern updated",field:"Medical",branch:"MBBS",cat:"Exams",date:"2026-10-22",summary:"Key changes to section weighting announced for next session."},
 {id:"n7",title:"AI tool detects diabetic retinopathy early",field:"Medical",branch:"MBBS",cat:"Research",date:"2026-10-15",summary:"Hospital study shows 94% screening accuracy."},
 {id:"n8",title:"New GST rules: what commerce students should know",field:"Commerce",branch:"Accounting",cat:"Policy",date:"2026-10-21",summary:"A simple breakdown of the latest tax reforms."},
 {id:"n9",title:"Fintech hiring up 30% for fresh graduates",field:"Commerce",branch:"Finance",cat:"Careers",date:"2026-10-19",summary:"Payments and lending startups lead campus hiring."},
 {id:"n10",title:"Supreme Court landmark ruling on data privacy",field:"Law",branch:"LLB",cat:"Policy",date:"2026-10-23",summary:"Ruling reshapes consent rules for digital platforms."},
 {id:"n11",title:"National moot court season announced",field:"Law",branch:"BA LLB",cat:"Events",date:"2026-10-17",summary:"Registrations open for 60+ participating colleges."},
 {id:"n12",title:"Digital humanities labs launch in 12 universities",field:"Arts",branch:"History",cat:"Research",date:"2026-10-16",summary:"Archives go digital with student research assistants."},
 {id:"n13",title:"James Webb spots water on distant exoplanet",field:"Science",branch:"Physics",cat:"Research",date:"2026-10-27",summary:"A breakthrough for astrobiology research."},
 {id:"n14",title:"CRISPR therapy approved for sickle cell",field:"Science",branch:"Biology",cat:"Research",date:"2026-10-14",summary:"Gene editing moves from lab to clinic."},
 {id:"n15",title:"Startups prefer MBAs with analytics skills",field:"Management",branch:"MBA",cat:"Careers",date:"2026-10-20",summary:"SQL and dashboards are the new must-haves."},
 {id:"n16",title:"Campus mental-health week across colleges",field:"All",branch:"All",cat:"Campus",date:"2026-10-26",summary:"Free counselling sessions and workshops for all students."}
];
const OPPS = [
 {id:"o1",title:"Frontend Developer Intern",org:"PixelSoft",type:"Internships",field:"Engineering",branch:"CSE",deadline:"2026-11-10",elig:"2nd–4th year CSE/IT",reward:"₹15,000/month · Remote"},
 {id:"o2",title:"Smart India Hackathon 2026",org:"Govt. of India",type:"Hackathons",field:"Engineering",branch:"All",deadline:"2026-11-05",elig:"Teams of 6, any branch",reward:"₹1,00,000 prize"},
 {id:"o3",title:"Machine Learning Specialization",org:"Coursera",type:"Courses",field:"Engineering",branch:"AI/ML",deadline:"2026-12-01",elig:"Basic Python",reward:"Free with financial aid"},
 {id:"o4",title:"VLSI Design Internship",org:"ChipWorks",type:"Internships",field:"Engineering",branch:"ECE",deadline:"2026-11-20",elig:"3rd/4th year ECE",reward:"₹20,000/month"},
 {id:"o5",title:"Women in STEM Scholarship",org:"TechForward Foundation",type:"Scholarships",field:"Engineering",branch:"All",deadline:"2026-11-15",elig:"Female students, CGPA 7+",reward:"₹50,000/year"},
 {id:"o6",title:"Auto Design Challenge",org:"SAE India",type:"Competitions",field:"Engineering",branch:"Mechanical",deadline:"2026-12-10",elig:"Mechanical/Automobile",reward:"Trophy + internship"},
 {id:"o7",title:"Clinical Research Internship",org:"City Hospital",type:"Internships",field:"Medical",branch:"MBBS",deadline:"2026-11-08",elig:"MBBS 3rd year+",reward:"Stipend + certificate"},
 {id:"o8",title:"National Medical Merit Scholarship",org:"Health Ministry",type:"Scholarships",field:"Medical",branch:"All",deadline:"2026-11-30",elig:"Family income < ₹8L",reward:"Full tuition"},
 {id:"o9",title:"Audit Trainee",org:"Deloitte",type:"Jobs",field:"Commerce",branch:"Accounting",deadline:"2026-11-25",elig:"Final year B.Com",reward:"₹4.5 LPA"},
 {id:"o10",title:"Stock Market Simulation League",org:"NSE Academy",type:"Competitions",field:"Commerce",branch:"Finance",deadline:"2026-11-12",elig:"Any commerce student",reward:"₹25,000 prize"},
 {id:"o11",title:"Legal Research Intern",org:"Supreme Legal LLP",type:"Internships",field:"Law",branch:"All",deadline:"2026-11-18",elig:"LLB 2nd year+",reward:"₹10,000/month"},
 {id:"o12",title:"Creative Writing Fellowship",org:"Literary Society",type:"Scholarships",field:"Arts",branch:"English",deadline:"2026-12-05",elig:"Arts students",reward:"₹30,000 grant"},
 {id:"o13",title:"Summer Research Fellowship",org:"IISc",type:"Research",field:"Science",branch:"All",deadline:"2026-11-28",elig:"BSc/MSc students",reward:"8 weeks paid research"},
 {id:"o14",title:"Marketing Case Competition",org:"HUL",type:"Competitions",field:"Management",branch:"Marketing",deadline:"2026-11-14",elig:"BBA/MBA",reward:"PPI + ₹2,00,000"},
 {id:"o15",title:"Annual Tech & Cultural Fest",org:"Your College",type:"Events",field:"All",branch:"All",deadline:"2026-11-22",elig:"All students",reward:"Workshops, prizes"},
 {id:"o16",title:"Data Analyst Graduate Role",org:"Analytica",type:"Jobs",field:"All",branch:"All",deadline:"2026-12-15",elig:"Any graduate with SQL",reward:"₹6 LPA"}
];
