import { Heart, Youtube, Instagram, Twitch, Music } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'YouTube',
    url: 'https://youtube.com/@seiko_esposodegabi?si=JdcX9WKypjYz7p1m',
    icon: Youtube,
    color: 'hover:text-red-500'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/ethan_tomokari',
    icon: Instagram,
    color: 'hover:text-pink-500'
  },
  {
    name: 'Twitch',
    url: 'https://twitch.tv/seiko_vt',
    icon: Twitch,
    color: 'hover:text-purple-500'
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@tomokari_',
    icon: Music,
    color: 'hover:text-blue-400'
  }
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Logo and Brand */}
          <div className="text-red-600 text-xl font-bold mb-4 md:mb-0">
            TOMFLIX
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <span className="text-gray-400 text-sm hidden md:block">Síguenos en:</span>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    title={social.name}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-6 text-gray-400 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Ayuda
            </Link>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="pt-6 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm leading-relaxed max-w-4xl mx-auto">
            <p className="mb-2">
              Copyright © 2025 - 2025 SeikoVT
            </p>
            <p className="text-xs leading-relaxed">
              'Tomflix', los logotipos de Tomflix y el nombre son marcas registradas propiedad de SeikoVT. 
              Todos los demás nombres de productos, logotipos y marcas mencionados son propiedad de sus respectivos titulares.
            </p>
          </div>
        </div>
        
        {/* Made with Love */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-center text-gray-500 text-xs flex items-center justify-center">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 mx-1 text-red-500" />
            <span>por SeikoVT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}