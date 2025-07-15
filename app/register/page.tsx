'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navigation */}
      <nav className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:text-gray-300"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auth.back')}
          </Button>
          <div className="text-red-600 text-2xl font-bold">
            TOMFLIX
          </div>
        </div>
      </nav>

      {/* Background */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Netflix Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Register Form */}
        <div className="relative z-10 flex items-center justify-center min-h-full p-4">
          <div className="w-full max-w-md">
            <RegisterForm />
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-white hover:underline"
                >
                  {t('auth.signInHere')}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright Footer */}
        <div className="relative z-10 mt-auto">
          <div className="bg-black/50 backdrop-blur-sm border-t border-gray-700/50 py-6">
            <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm leading-relaxed">
              <p className="mb-2">
                Copyright © 2025 - 2025 SeikoVT
              </p>
              <p className="text-xs leading-relaxed">
                'Tomflix', los logotipos de Tomflix y el nombre son marcas registradas propiedad de SeikoVT. 
                Todos los demás nombres de productos, logotipos y marcas mencionados son propiedad de sus respectivos titulares.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}