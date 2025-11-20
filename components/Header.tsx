
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#0077F2] text-white py-2 text-center">
      <div className="inline-block">
        {/* 
          INSTRUCCIÓN: 
          Sube tu logo a un servicio como https://imgur.com/upload
          Luego, haz clic derecho en la imagen subida -> "Copiar dirección de la imagen"
          Finalmente, reemplaza la URL de abajo con la que copiaste.
        */}
        <img 
          src="https://i.imgur.com/DZ04yVD.png" 
          alt="Game Over Logo" 
          className="h-16" 
        />
      </div>
    </header>
  );
};

export default Header;
