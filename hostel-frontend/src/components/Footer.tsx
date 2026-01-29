import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

// Create a SocialIcons.jsx component or use inline SVGs:

// Facebook SVG Icon
const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

// Instagram SVG Icon
const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

// Twitter/X SVG Icon
const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Quick Links": [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Rooms & Facilities", path: "/rooms" },
      { name: "Gallery", path: "/gallery" },
      { name: "Contact", path: "/contact" },
    ],
    Facilities: [
      { name: "AC Rooms", path: "/facilities#ac" },
      { name: "Wi-Fi Internet", path: "/facilities#wifi" },
      { name: "Laundry Service", path: "/facilities#laundry" },
      { name: "24/7 Security", path: "/facilities#security" },
      { name: "Mess Facility", path: "/facilities#mess" },
    ],
    Legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Accessibility", path: "/accessibility" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: "#",
      color: "hover:bg-primary-shade hover:text-primary",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      url: "#",
      color: "hover:bg-primary-shade hover:text-primary",
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      url: "#",
      color: "hover:bg-primary-shade hover:text-primary",
    },
    {
      name: "Chat",
      icon: ChatBubbleLeftRightIcon,
      url: "#",
      color: "hover:bg-primary-shade hover:text-primary",
    },
  ];

  return (
    <footer className="bg-heading-color text-light-color mt-auto font-sans">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary text-light-color rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Officers Hostel</h3>
                <p className="text-meta-color text-sm">Premium Accommodation</p>
              </div>
            </div>
            <p className="text-meta-color text-sm leading-relaxed">
              Providing exceptional accommodation services with world-class facilities 
              and a homely environment for officers and students.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-light-color">
                <MapPinIcon className="h-5 w-5 text-primary" />
                <span className="text-sm">123 University Road, Academic City</span>
              </div>
              <div className="flex items-center space-x-3 text-light-color">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-light-color">
                <EnvelopeIcon className="h-5 w-5 text-primary" />
                <span className="text-sm">info@officershostel.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-medium text-light-color mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-meta-color hover:text-primary hover:pl-2 transition-all duration-300 inline-block text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-light-color mb-4">
                Stay Updated
              </h4>
              <p className="text-meta-color text-sm mb-4">
                Subscribe to our newsletter for updates and offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 rounded-l-btn text-heading-color focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button className="px-4 py-2.5 bg-primary text-light-color hover:bg-dark-shade rounded-r-btn transition-colors duration-300 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-medium text-light-color mb-4">
                Connect With Us
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`p-3 bg-black-color text-meta-color rounded-btn ${social.color} transition-all duration-300`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-color">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-meta-color text-sm">
              © {currentYear} Officers Hostel. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-meta-color hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-meta-color hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-meta-color hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Support */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="tel:+15551234567"
          className="p-4 bg-primary text-light-color rounded-full shadow-xl hover:shadow-2xl hover:bg-dark-shade transition-all duration-300 group flex items-center justify-center"
          aria-label="24/7 Support"
        >
          <PhoneIcon className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-secondary text-light-color text-xs px-2 py-1 rounded-full">
            24/7
          </span>
        </a>
      </div>
    </footer>
  );
}