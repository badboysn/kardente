import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="bg-white min-h-screen grid grid-cols-2">
      <div className="bg-green-5 flex justify-center items-center">
        <LoginForm />
      </div>


      <div className="py-20 px-18 flex justify-center rounded-2xl">
      <div className="relative w-full min-h-[80vh] bg-[url('/bg.jpg')] rounded-2xl bg-cover bg-center flex items-center justify-center px-6">
      
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl"></div>

      {/* Card moderne */}
      <div className="relative max-w-2xl w-full p-10 flex flex-col gap-10">
        
        <h1 className="text-4xl md:text-6xl font-bold text-orange-600 mb-6">Kardente</h1>

        <p className="text-white/90 text-2xl mb-8 leading-relaxed">
          Créez, gérez et sécurisez vos badges d'identification en toute simplicité.  
          Notre plateforme vous permet de générer des badges professionnels 
          avec QR code, chiffrement avancé et gestion centralisée des utilisateurs.
        </p>

        <button className="bg-white text-black py-6 text-xl rounded-full font-semibold shadow-lg cursor-pointer transition-all duration-300">
          Commencer maintenant par vous-connectez
        </button>

        {/* Footer */}
        <div className="mt-10 text-white text-sm">
          <p className="text-xl italic">© {new Date().getFullYear()} <span className="font-semibold text-orange-600 text-2xl">Kardente</span>. Tous droits réservés.</p>
        </div>
      </div>
      </div>
      
      </div>
    
    </main>
  );
}
