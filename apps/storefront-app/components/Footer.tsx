import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLocation, faMobile, faMailForward } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <img
                  src={
                    'https://res.cloudinary.com/dpdfyou3r/image/upload/v1767265363/logo/3A_gczh29.png'
                  }
                  alt={'3A Softwares'}
                  className="object-contain w-16"
                />
              </div>
              <h3 className="font-extrabold text-xl bg-clip-text text-transparent bg-white">
                3A Softwares
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted online marketplace for quality products at competitive prices. Shop with
              confidence and style.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  href="/products?discount=true"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMailForward} className="w-3 h-3" />
                <a
                  href="mailto:3asoftwares@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  3asoftwares@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMobile} className="w-3 h-3" />
                <a href="tel:1-800-4567" className="hover:text-blue-400 transition-colors">
                  +91 7047026537
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocation} className="w-3 h-3" />
                <span>167, Dayanand Ward, Sagar Madhya Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex gap-4 mb-6 sm:mb-0">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                in
              </a>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-sm mb-2">
                © 2025 3A Softwares. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
