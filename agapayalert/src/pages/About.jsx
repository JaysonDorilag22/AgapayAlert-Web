import React, {useState, useEffect} from "react";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import logoimago from "../assets/AGAPAYALERT - imagotype.svg";
import makatichief from "../assets/Chiefs/makatichief.png";
import makati from "../assets/pnplogo/MakatiLogo.svg";
import taguig from "../assets/pnplogo/TaguigLogo.svg";
import pasay from "../assets/pnplogo/PasayLogo.svg";
import paranaque from "../assets/pnplogo/ParanaqueLogo.svg";
import pateros from "../assets/pnplogo/PaterosLogo.svg";
import tup from "../assets/TUP.png";
import taguigchief from "../assets/Chiefs/taguigchief.png";
import pasaychief from "../assets/Chiefs/pasaychief.png";
import paranaquechief from "../assets/Chiefs/paranaquechief.png";

const slides = [
    {
      name: "PCOL JEAN I. DELA TORRE",
      title: "Officer in Charge, Makati CPS",
      description: "Located in the heart of Makati, one of the Philippines’ busiest business districts, the Makati City Police Station plays a crucial role in maintaining peace and order in a city with a daytime population of over a million people. Under the leadership of PCOL Jean I. Dela Torre, the station ensures the safety of residents, workers, and visitors by addressing various public safety concerns.",
      image: makatichief
    },
    {
      name: "PCOL JOEY T. GOFORTH",
      title: "Chief of Police, Taguig CPS",
      description: "Situated in Taguig, a rapidly growing urban center known for Bonifacio Global City and government institutions, the Taguig City Police Station serves and protects a population of over 1 million residents. Led by PCOL Joey T. Goforth, the station plays a critical role in maintaining safety in one of Metro Manila's most dynamic cities.",
      image: taguigchief
    },
    {
      name: "PCOL SAMUEL B. PABONITA",
      title: "Officer in Charge, Pasay CPS",
      description: "Located in Pasay, a bustling city home to major landmarks such as the Ninoy Aquino International Airport and popular entertainment hubs, the Pasay City Police Station protects a population of over 440,000 residents. Under the leadership of PCOL Samuel B. Pabonita, the station ensures public safety in this vital area, which serves as a gateway to Metro Manila and a connecting point to neighboring cities.",
      image: pasaychief
    },
    {
      name: "PCOL MELVIN RIATAZA MONTANTE",
      title: "Chief of Police, Parañaque CPS",
      description: "Situated in Parañaque, a gateway city near the Ninoy Aquino International Airport, the Parañaque City Police Station is dedicated to safeguarding a population of over 700,000 residents. Led by PCOL Melvin Riataza Montante, the station plays a vital role in ensuring the security of this highly urbanized area, which serves as a key transportation and commercial hub.",
      image: paranaquechief
    },
    {
      name: "PCOL ANTHONY C. GANTANG",
      title: "Chief of Police, Pateros MPS",
      description: "Located in Pateros, the smallest municipality in Metro Manila, the Pateros Municipal Police Station is dedicated to protecting its close-knit population of over 63,000 residents. Under the leadership of PCOL Anthony C. Gantang, the station ensures safety and order in this historic and peaceful town.",
      image: pateros
    },
    {
      name: "TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES",
      title: "TAGUIG CAMPUS",
      description: "TUP-Taguig is a premier state university located in Taguig City, offering top-notch education in engineering, technology, and applied sciences. Known for producing skilled and innovative professionals, TUP-Taguig plays a vital role in shaping the workforce of Metro Manila and beyond.",
      image: tup
    }
  ];

  const images = [
    { src: makati, alt: "Makati", index: 0 },
    { src: taguig, alt: "Taguig", index: 1 },
    { src: pasay, alt: "Pasay", index: 2 },
    { src: paranaque, alt: "Paranaque", index: 3 },
    { src: pateros, alt: "Pateros", index: 4 },
    { src: tup, alt: "TUP", index: 5 },
  ];


const About = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 8000);
  
      return () => clearInterval(timer);
    }, []);
  
    const handlePrevClick = () => {
      setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };
  
    const handleNextClick = () => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    return (
    <div className="relative min-h-screen">
      <div className="h-screen">
        <div className="h-full w-full place-items-center">
          <div className="Container bg-[#123F7B] h-[440px] w-full rounded-[75px] shadow-lg px-[24px] overflow-hidden content-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 justify-between gap-2">
              <div className="flex flex-col justify-start w-full max-w-xl py-2 pl-4 lg:pl-12 content-center">
                <p className="text-white text-lg lg:text-2xl font-extrabold">Building Safer Communities Together</p>
                <p className="text-white text-sm lg:text-base font-base pt-1">Empowering Communities with Real-Time Alerts and Swift Responses.</p>
                <p className="text-white text-base lg:text-lg font-semibold pt-4">Mission</p>
                <p className="text-white text-xs lg:text-sm font-light pt-1">To enhance public safety in urban areas by providing a reliable system for rapid incident reporting and response. AgapayReady ensures quick information dissemination, fosters community engagement, and facilitates seamless coordination with law enforcement to protect lives.</p>
                <p className="text-white text-base lg:text-lg font-semibold pt-4">Vision</p>
                <p className="text-white text-xs lg:text-sm font-light pt-1">To build safer communities through real-time updates, active public participation, and secure technology, ensuring efficient responses to critical incidents and fostering trust between citizens and law enforcement.</p>
              </div>
              <div className="flex flex-col justify-end w-full h-full">
                <div className="Container bg-white rounded-[75px] place-items-center overflow-hidden">
                  <img src={logoimago} alt="placeholder" className="object-contain w-[300px] h-[200px] lg:w-[600px] lg:h-[360px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="Container bg-white h-[600px] w-full mt-4">
            <div className="relative w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 justify-between gap-2">
                <div className="flex flex-col justify-start w-full pl-4 lg:pl-32 pt-8 lg:pt-16 content-start">
                  <p className="text-[#123F7B] text-2xl lg:text-4xl font-extrabold">{slides[currentSlide].name}</p>
                  <p className="text-[#D46A79] text-lg lg:text-2xl font-light pt-1">{slides[currentSlide].title}</p>
                  <p className="text-[#123F7B] text-sm lg:text-lg font-light pt-4 pr-4 lg:pr-12">{slides[currentSlide].description}</p>
                </div>
                <div className="flex flex-col justify-end w-full h-full place-items-center">
                  <img src={slides[currentSlide].image} alt="placeholder" className="object-contain w-[300px] h-[300px] lg:w-[600px] lg:h-[600px]" />
                </div>
              </div>
              <div className="fixed bottom-0 left-0 w-full px-4 py-2 backdrop-blur-lg bg-[#123F7B] bg-opacity-20 z-50">
                <div className="flex flex-row h-[100px] lg:h-[150px] w-full justify-between items-center space-x-4">
                  <FaArrowLeft className="text-white text-xl lg:text-2xl cursor-pointer" onClick={handlePrevClick} />
                  <div className="flex flex-row justify-center items-center space-x-12 lg:space-x-24">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        className={`object-contain ${currentSlide === image.index ? 'w-[75px] h-[75px] lg:w-[125px] lg:h-[125px]' : 'w-[50px] h-[50px] lg:w-[80px] lg:h-[80px]'}`}
                      />
                    ))}
                  </div>
                  <FaArrowRight className="text-white text-xl lg:text-2xl cursor-pointer" onClick={handleNextClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default About;