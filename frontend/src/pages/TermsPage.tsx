import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-dark-900 mb-2">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-dark-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                1. Présentation du service
              </h2>
              <p className="text-dark-700 leading-relaxed">
                Create est une plateforme de création graphique en ligne permettant aux utilisateurs
                de créer, éditer et exporter des designs, retouches photo et montages vidéo. Le
                service est accessible à l'adresse{' '}
                <a href="https://create.myziggi.pro" className="text-primary-600 hover:underline">
                  create.myziggi.pro
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                2. Acceptation des conditions
              </h2>
              <p className="text-dark-700 leading-relaxed">
                En accédant et en utilisant Create, vous acceptez d'être lié par ces Conditions
                Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas
                utiliser le service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                3. Utilisation du service
              </h2>
              <h3 className="text-xl font-medium text-dark-800 mb-3">3.1 Compte utilisateur</h3>
              <p className="text-dark-700 leading-relaxed mb-4">
                Actuellement, Create fonctionne sans nécessiter de compte utilisateur. Tous les
                projets sont stockés localement dans votre navigateur.
              </p>

              <h3 className="text-xl font-medium text-dark-800 mb-3">3.2 Utilisation acceptable</h3>
              <p className="text-dark-700 leading-relaxed mb-2">Vous vous engagez à :</p>
              <ul className="list-disc list-inside text-dark-700 space-y-2 ml-4">
                <li>Utiliser le service de manière légale et éthique</li>
                <li>
                  Ne pas créer de contenu illégal, diffamatoire, obscène ou portant atteinte aux
                  droits d'autrui
                </li>
                <li>
                  Respecter les droits de propriété intellectuelle des contenus tiers (images,
                  polices, etc.)
                </li>
                <li>Ne pas tenter de compromettre la sécurité ou les performances du service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                4. Contenu et propriété intellectuelle
              </h2>
              <h3 className="text-xl font-medium text-dark-800 mb-3">4.1 Votre contenu</h3>
              <p className="text-dark-700 leading-relaxed mb-4">
                Vous conservez tous les droits sur les contenus que vous créez avec Create. Vous
                êtes responsable de vous assurer que vous disposez des droits nécessaires pour
                utiliser tous les éléments (images, polices, etc.) que vous intégrez dans vos
                créations.
              </p>

              <h3 className="text-xl font-medium text-dark-800 mb-3">4.2 Photos Unsplash</h3>
              <p className="text-dark-700 leading-relaxed mb-2">
                Les photos fournies via l'intégration Unsplash sont soumises à la{' '}
                <a
                  href="https://unsplash.com/license"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  licence Unsplash
                </a>
                . En utilisant ces photos, vous acceptez :
              </p>
              <ul className="list-disc list-inside text-dark-700 space-y-2 ml-4">
                <li>De ne pas vendre les photos sans modification substantielle</li>
                <li>De ne pas compiler les photos pour créer une banque d'images similaire</li>
                <li>
                  De créditer le photographe lorsque cela est raisonnablement possible (non
                  obligatoire mais apprécié)
                </li>
              </ul>

              <h3 className="text-xl font-medium text-dark-800 mb-3 mt-4">
                4.3 Propriété du service
              </h3>
              <p className="text-dark-700 leading-relaxed">
                Le code source, l'interface, les fonctionnalités et tous les éléments du service
                Create sont protégés par le droit d'auteur et restent la propriété exclusive de
                leurs créateurs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                5. Stockage et confidentialité
              </h2>
              <h3 className="text-xl font-medium text-dark-800 mb-3">5.1 Stockage local</h3>
              <p className="text-dark-700 leading-relaxed mb-4">
                Vos projets sont actuellement stockés dans le stockage local (localStorage) de votre
                navigateur. Nous n'avons pas accès à ces données. Il est de votre responsabilité de
                sauvegarder vos projets en les exportant régulièrement.
              </p>

              <h3 className="text-xl font-medium text-dark-800 mb-3">
                5.2 Données de navigation
              </h3>
              <p className="text-dark-700 leading-relaxed">
                Nous ne collectons actuellement aucune donnée personnelle. Des cookies techniques
                peuvent être utilisés pour le fonctionnement du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                6. Limitation de responsabilité
              </h2>
              <p className="text-dark-700 leading-relaxed mb-4">
                Create est fourni "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas
                responsables :
              </p>
              <ul className="list-disc list-inside text-dark-700 space-y-2 ml-4">
                <li>De la perte de vos projets ou données</li>
                <li>Des interruptions de service</li>
                <li>Des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser le service</li>
                <li>De l'utilisation que vous faites des contenus créés</li>
                <li>
                  Des violations de droits d'auteur résultant de votre utilisation de contenus tiers
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                7. Modifications du service et des CGU
              </h2>
              <p className="text-dark-700 leading-relaxed">
                Nous nous réservons le droit de modifier ces Conditions Générales d'Utilisation à
                tout moment. Les modifications prendront effet dès leur publication sur cette page.
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">
                8. Résiliation
              </h2>
              <p className="text-dark-700 leading-relaxed">
                Nous nous réservons le droit de suspendre ou de résilier votre accès au service à
                tout moment, sans préavis, en cas de violation de ces conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">9. Droit applicable</h2>
              <p className="text-dark-700 leading-relaxed">
                Ces conditions sont régies par le droit français. Tout litige relatif à
                l'utilisation du service sera soumis à la compétence exclusive des tribunaux
                français.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dark-900 mb-4">10. Contact</h2>
              <p className="text-dark-700 leading-relaxed">
                Pour toute question concernant ces Conditions Générales d'Utilisation, vous pouvez
                nous contacter via le dépôt GitHub du projet ou par email à l'adresse indiquée dans
                la documentation.
              </p>
            </section>

            <div className="mt-12 p-6 bg-primary-50 rounded-lg">
              <p className="text-sm text-dark-600">
                <strong>Note importante :</strong> Create est un projet en développement actif. Ces
                conditions peuvent évoluer au fur et à mesure de l'ajout de nouvelles
                fonctionnalités (authentification, cloud storage, etc.).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-dark-500">
          <p>
            © {new Date().getFullYear()} Create. Tous droits réservés. |{' '}
            <Link to="/" className="text-primary-600 hover:underline">
              Accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
