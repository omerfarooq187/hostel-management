import {
  BuildingOfficeIcon,
  UsersIcon,
  ShieldCheckIcon,
  ClockIcon,
  AcademicCapIcon,
  HomeIcon,
  WifiIcon,
  BeakerIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function About() {
  const features = [
    {
      icon: <BuildingOfficeIcon className="h-8 w-8" />,
      title: "Modern Infrastructure",
      description: "Well-designed hostel buildings with modern amenities and comfortable living spaces.",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance and trained security personnel.",
    },
    {
      icon: <WifiIcon className="h-8 w-8" />,
      title: "High-Speed Internet",
      description: "Uninterrupted high-speed Wi-Fi connectivity throughout the campus.",
    },
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: "Comfortable Rooms",
      description: "Spacious, well-ventilated rooms with modern furniture and amenities.",
    },
    {
      icon: <BeakerIcon className="h-8 w-8" />,
      title: "Study Facilities",
      description: "Dedicated study rooms, libraries, and computer labs for academic excellence.",
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Healthcare",
      description: "On-campus medical facilities with 24/7 availability of medical staff.",
    },
  ];

  const managementTeam = [
    {
      name: "Dr. James Wilson",
      role: "Hostel Director",
      description: "Over 15 years of experience in student accommodation management.",
    },
    {
      name: "Ms. Sarah Johnson",
      role: "Administrative Head",
      description: "Specialized in hostel operations and student welfare services.",
    },
    {
      name: "Mr. Robert Chen",
      role: "Facility Manager",
      description: "Expert in infrastructure maintenance and facility management.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80"
            alt="Hostel Campus"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Officers Hostel
            </h1>
            <p className="text-xl text-gray-200">
              Providing premium accommodation and fostering a conducive environment 
              for academic and personal growth since 2010.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 text-white rounded-xl">
                <AcademicCapIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg">
              To provide safe, comfortable, and affordable accommodation that supports 
              students' academic journey while promoting personal development and 
              community living values.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-600 text-white rounded-xl">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 text-lg">
              To be the leading student accommodation provider recognized for excellence 
              in facilities, student support services, and community development.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Facilities & Services
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive facilities to ensure a comfortable and productive stay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-200">Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12+</div>
              <div className="text-blue-200">Years</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Management Team
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Dedicated professionals committed to providing the best accommodation experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {managementTeam.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <UsersIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              <div className="text-blue-600 font-medium mb-3">
                {member.role}
              </div>
              <p className="text-gray-600">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <ClockIcon className="h-5 w-5 text-white" />
            <span className="text-white font-medium">24/7 Support</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-6">
            Need More Information?
          </h2>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team is always ready to assist you with any inquiries about accommodation, 
            facilities, or the admission process.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15551234567"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call Now: +1 (555) 123-4567
            </a>
            <a
              href="mailto:info@officershostel.com"
              className="px-8 py-3 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}