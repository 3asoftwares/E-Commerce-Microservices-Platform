import React, { useState } from 'react';
import { Button, Modal } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faShoppingBag,
  faShoppingCart,
  faEnvelope,
  faPhone,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../i18n/I18nContext';
import { getCurrentUser } from '@3asoftwares/utils/client';

interface WelcomePageProps {
  onSignupClick?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onSignupClick }) => {
  const user = getCurrentUser();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { t } = useTranslation();

  const scrollToPlatform = () => {
    document.getElementById('platform-features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openApp = (url: string) => {
    window.location.href = `${url}?userId=${user ? user.id : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-50 via-white to-white-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('welcome.title')} <span className="text-blue-600 dark:text-blue-400">{t('welcome.brandName')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              {t('welcome.subtitle')}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('welcome.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-16 w-40 mx-auto">
            <Button
              size="lg"
              variant="primary"
              className="shadow-lg hover:shadow-xl"
              onClick={scrollToPlatform}
            >
              {t('welcome.getStarted')}
            </Button>
          </div>
        </div>
      </section>

      <section id="platform-features" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {t('features.title')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faCog} className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('features.adminPortal.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('features.adminPortal.description')}
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                <span>{t('features.adminPortal.features.userManagement')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                <span>{t('features.adminPortal.features.analytics')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                <span>{t('features.adminPortal.features.orderTracking')}</span>
              </li>
            </ul>
            <Button
              variant="primary"
              className="w-full !bg-blue-600 !border-blue-600 !hover:bg-blue-700"
              onClick={() => openApp(process.env.ADMIN_APP_URL || 'http://localhost:3001')}
            >
              {t('features.adminPortal.button')}
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
              <FontAwesomeIcon
                icon={faShoppingBag}
                className="w-8 h-8 text-green-600 dark:text-green-400"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('features.sellerPortal.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('features.sellerPortal.description')}
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                <span>{t('features.sellerPortal.features.productCatalog')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                <span>{t('features.sellerPortal.features.inventoryTracking')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                <span>{t('features.sellerPortal.features.salesAnalytics')}</span>
              </li>
            </ul>
            <Button
              variant="primary"
              className="w-full !bg-green-600 !border-green-600 !hover:bg-green-700"
              onClick={() => openApp(process.env.SELLER_APP_URL || 'http://localhost:3002')}
            >
              {t('features.sellerPortal.button')}
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('features.storefront.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('features.storefront.description')}
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                <span>{t('features.storefront.features.productSearch')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                <span>{t('features.storefront.features.secureCheckout')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                <span>{t('features.storefront.features.orderTracking')}</span>
              </li>
            </ul>
            <Button
              variant="primary"
              className="w-full !bg-purple-600 !border-purple-600 !hover:bg-purple-700"
              onClick={() => openApp('http://localhost:3003')}
            >
              {t('features.storefront.button')}
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('cta.description')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center w-[300px]">
            <Button
              size="lg"
              variant="secondary"
              className="shadow-lg hover:shadow-xl bg-white text-blue-600 hover:bg-gray-100 border-0"
              onClick={onSignupClick}
            >
              {t('cta.createAccount')}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="shadow-lg hover:shadow-xl text-white border-2 border-white hover:bg-white hover:text-blue-600"
              onClick={() => setShowSupportModal(true)}
            >
              {t('cta.support')}
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title={t('support.title')}
        size="md"
      >
        <div className="space-y-6 py-2">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('support.description')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('support.email')}</h4>
                <a
                  href={`mailto:${t('support.emailAddress')}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  {t('support.emailAddress')}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('support.phone')}</h4>
                <a
                  href={`tel:${t('support.phoneNumber')}`}
                  className="text-green-700 dark:text-green-400 hover:underline font-semibold"
                >
                  {t('support.phoneNumber')}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faClock}
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t('support.hours')}</h4>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {t('support.hoursValue')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};