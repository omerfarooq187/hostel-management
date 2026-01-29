// HomePage.jsx - Complete one-page website
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";// Our updated navbar
import Footer from "../../components/Footer"; // Keep the same footer
import { 
  BuildingOfficeIcon, WifiIcon, ShieldCheckIcon, 
  SparklesIcon, StarIcon, UserGroupIcon, 
  MapPinIcon, PhoneIcon, EnvelopeIcon, 
  ChevronRightIcon, CalendarIcon,
  UsersIcon, TrophyIcon, HeartIcon,
  CheckCircleIcon, ArrowRightIcon,
  HomeModernIcon
} from "@heroicons/react/24/outline";

const BedIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 14h14M5 17v-4m14 4v-4m-7-7v4m0-4h3m-3 0H8m8 8H8m8 0v2M8 17v2"
    />
  </svg>
);

export default function HomePage() {
  const { token, user } = useAuth();
  
  // Room data
  const rooms = [
    {
      type: "Standard Suite",
      price: "$99/night",
      features: ["Single Bed", "Private Bathroom", "Wi-Fi", "AC"],
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
    },
    {
      type: "Deluxe Room",
      price: "$149/night",
      features: ["Double Bed", "Ensuite", "TV", "Mini-fridge"],
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w-800&q=80"
    },
    {
      type: "Executive Suite",
      price: "$199/night",
      features: ["King Bed", "Living Area", "Kitchenette", "Balcony"],
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"
    }
  ];
  
  // Testimonials
  const testimonials = [
    {
      name: "Col. James Anderson",
      role: "Resident since 2022",
      text: "The Officers Hostel exceeded all my expectations. The attention to detail and service is exceptional.",
      rating: 5
    },
    {
      name: "Maj. Sarah Williams",
      role: "Resident since 2021",
      text: "Perfect blend of comfort and professionalism. The facilities are top-notch and the staff is wonderful.",
      rating: 5
    },
    {
      name: "Lt. Michael Chen",
      role: "Resident since 2023",
      text: "Best accommodation experience I've had. Highly recommended for all officers.",
      rating: 5
    }
  ];
  
  return (
    <div className="bg-white font-sans">

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-heading-color via-dark-shade/95 to-secondary/90" />
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=80"
            alt="Luxury Hostel Interior"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        {/* Hero Content */}
        <div className="container relative mx-auto px-4 pt-20">
          <div className="max-w-4xl text-light-color">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-light-color/20 backdrop-blur-sm rounded-full mb-8">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Premium Accommodation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">
              Welcome to
              <br />
              <span className="text-primary">Officers Hostel</span>
            </h1>
            
            <p className="text-xl text-light-color/90 mb-10 max-w-2xl leading-relaxed">
              Experience premium accommodation designed for officers with world-class amenities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!token ? (
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-dark-shade text-light-color rounded-btn font-medium transition-all duration-300 hover:shadow-xl w-full sm:w-auto"
                >
                  <span>Begin Your Experience</span>
                  <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-dark-shade text-light-color rounded-btn font-medium transition-all duration-300 hover:shadow-xl w-full sm:w-auto"
                >
                  <span>Go to Dashboard</span>
                  <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              
              <button
                onClick={() => {
                  const features = document.getElementById('features');
                  features?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-light-color/30 hover:border-light-color hover:bg-light-color/10 text-light-color rounded-btn font-medium transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                <span>Explore Features</span>
                <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* ABOUT SECTION */}
      <section id="about" className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-shade text-primary rounded-full mb-4">
              <HeartIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Our Story</span>
            </div>
            <h2 className="text-4xl font-medium text-heading-color mb-5">
              About Officers Hostel
            </h2>
            <p className="text-foreground text-lg max-w-3xl mx-auto">
              Established with the vision to provide exceptional accommodation for officers,
              we combine luxury, comfort, and professional environment in one perfect package.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-heading-color">
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                {[
                  "Premium furnished rooms with modern amenities",
                  "24/7 security and professional staff",
                  "High-speed internet and smart room technology",
                  "Community events and networking opportunities",
                  "Central location with easy access to facilities"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
                alt="About Us"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-light-color p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FEATURES SECTION */}
      <section id="features" className="bg-primary-shade py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-light-color rounded-full mb-4">
              <StarIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Premium Features</span>
            </div>
            <h2 className="text-4xl font-medium text-heading-color mb-5">
              Unmatched Comfort & Amenities
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "24/7 Security",
                description: "Round-the-clock security with CCTV surveillance and professional staff"
              },
              {
                icon: WifiIcon,
                title: "High-Speed Internet",
                description: "Fiber optic internet with dedicated connections for each room"
              },
              {
                icon: UsersIcon,
                title: "Community Events",
                description: "Regular networking events and social gatherings for residents"
              },
              {
                icon: CalendarIcon,
                title: "Flexible Stays",
                description: "Short-term and long-term accommodation options available"
              },
              {
                icon: TrophyIcon,
                title: "Award-Winning Service",
                description: "Consistently rated 5-star for service and facilities"
              },
              {
                icon: BedIcon,
                title: "Premium Furnishings",
                description: "High-quality furniture and luxury bedding in all rooms"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-heading-color mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ROOMS SECTION */}
      <section id="rooms" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-shade text-primary rounded-full mb-4">
            <HomeModernIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Accommodation</span>
          </div>
          <h2 className="text-4xl font-medium text-heading-color mb-5">
            Our Room Selection
          </h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Choose from our range of premium rooms designed for comfort and productivity
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div key={index} className="bg-white border border-border-color rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={room.image}
                alt={room.type}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-heading-color">
                    {room.type}
                  </h3>
                  <div className="text-primary font-bold">{room.price}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {room.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-foreground">
                      <CheckCircleIcon className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={token ? "/booking" : "/login"}
                  className="w-full px-4 py-3 bg-heading-color hover:bg-primary text-light-color rounded-btn font-medium transition-colors duration-300 text-center block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="bg-heading-color py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-light-color rounded-full mb-4">
                <StarIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Testimonials</span>
              </div>
              <h2 className="text-4xl font-medium text-light-color mb-5">
                What Our Residents Say
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-light-color/20">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-light-color/90 italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-light-color">
                        {testimonial.name}
                      </div>
                      <div className="text-light-color/60 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CONTACT SECTION */}
      <section id="contact" className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-shade text-primary rounded-full mb-4">
              <EnvelopeIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Contact Us</span>
            </div>
            <h2 className="text-4xl font-medium text-heading-color mb-5">
              Get In Touch
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Have questions? We're here to help with your accommodation needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPinIcon className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-heading-color mb-1">
                    Visit Us
                  </h3>
                  <p className="text-foreground">123 University Road, Academic City</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <PhoneIcon className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-heading-color mb-1">
                    Call Us
                  </h3>
                  <p className="text-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <EnvelopeIcon className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-heading-color mb-1">
                    Email Us
                  </h3>
                  <p className="text-foreground">info@officershostel.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-border-color rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-heading-color mb-6">
                Send a Message
              </h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-border-color rounded-btn focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-border-color rounded-btn focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-border-color rounded-btn focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 border border-border-color rounded-btn focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-heading-color hover:bg-primary text-light-color rounded-btn font-medium transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}