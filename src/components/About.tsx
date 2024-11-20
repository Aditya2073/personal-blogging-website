import React from 'react';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl -z-10"></div>
        
        {/* Main content */}
        <div className="relative backdrop-blur-sm">
          <div className="text-center mb-16">
            <img
              src="/aditya-profile.jpg"
              alt="Aditya Rasal"
              className="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-white/10 shadow-xl transition-transform hover:scale-105"
            />
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Aditya Ganesh Rasal
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Aspiring Software Engineer
            </p>
            
            {/* Contact buttons */}
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="mailto:adirasal2003@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/adityaganeshrasal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/_2_aditya_0_?igsh=MW90aWNtN3J3MGR2cQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
              >
                <Instagram size={18} />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="space-y-16">
            {/* About Section */}
            <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">👋</span>
                About Me
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                I am an aspiring Software Engineer with a passion for developing innovative solutions. 
                Currently pursuing my Bachelor's in Artificial Intelligence and Data Science, I am eager 
                to contribute to dynamic teams, continuously learn new technologies, and create impactful 
                solutions that meet business objectives.
              </p>
            </section>

            {/* Education Section */}
            <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">🎓</span>
                Education
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Dr. D. Y. Patil Institute of Technology, Pimpri, Pune
                  </h3>
                  <p className="text-gray-400">B.E. in Artificial Intelligence and Data Science</p>
                </div>
                <div className="group">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    SVPM's Institute of Engineering and Technology, Baramati
                  </h3>
                  <p className="text-gray-400">Diploma in Information Technology</p>
                </div>
                <div className="group">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    St. Augustine High School, Vasai
                  </h3>
                  <p className="text-gray-400">SSC</p>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">💻</span>
                Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Technical Skills</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      Programming: Python, Java, OOP, DSA
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      DBMS: SQL, MySQL Workbench
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      Web Development: HTML, CSS, Bootstrap
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      Software Development: SDLC, Agile method
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Tools & Soft Skills</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Tools: VS Code, MS Excel, MS Word
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Task Prioritization
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Time Management
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Communication & Team Collaboration
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">💼</span>
                Experience
              </h2>
              <div className="group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Cyber Security Analyst (Intern)
                  </h3>
                  <p className="text-gray-400">October 2021 – January 2022</p>
                </div>
                <p className="text-blue-400 mb-4">HighRadius Technologies Pvt. Ltd., Hyderabad</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Scanned Server Logs for malicious Activity
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Formatted the Findings in Excel and submitted it to the person in charge
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;