import { LinkedIn, GitHub } from "@mui/icons-material";

const teamMembers = [
  {
    name: "Alper Öcal",
    role: "Full-Stack Developer",
    image: "/images/alper.png",
    linkedin: "#",
    github: "https://github.com/Alpi2",
  },
  {
    name: "Liang Wang",
    role: "Full-Stack Developerr",
    image: "/images/liang.png",
    linkedin: "#",
    github: "https://github.com/lwnl",
  },
  {
    name: "Murat Zenkin",
    role: "Full-Stack Developer",
    image: "/images/murat.jpeg",
    linkedin: "https://www.linkedin.com/in/murat-zenkin-2a04b32a5/",
    github: "https://github.com/Muratzenkin",
  },
  {
    name: "Sebastian Kues",
    role: "Full-Stack Developerr",
    image: "/images/sebastian.jpeg",
    linkedin: "#",
    github: "https://github.com/SebastianKues",
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-green-100 to-blue-100">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-4xl font-semibold text-gray-700 leading-relaxed tracking-wide mx-auto max-w-4xl">
          Lernen Sie die Menschen hinter der Innovation kennen.
        </h3>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          Unser talentiertes Team ist darauf spezialisiert, intelligente
          Lösungen für den Haushalt zu entwickeln. Entdecken Sie die kreativen
          Köpfe, die diese Vision zum Leben erwecken!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12 px-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-blue-50"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
            />
            <h3 className="text-lg font-semibold mt-4 text-gray-800">
              {member.name}
            </h3>
            <p className="text-sm text-gray-600">{member.role}</p>

            <div className="flex space-x-4 mt-3">
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <GitHub className="text-gray-500 hover:text-gray-700" />
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn className="text-blue-600 hover:text-blue-800" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
