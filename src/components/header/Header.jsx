import React from 'react';
import translations from '../../utils/translations';
import saccaroico from '../../assets/saccaro_ok.ico';

const Header = ({ lang }) => {
  return (
    <header>
      <div className="title-with-icon">
        <img src={saccaroico} alt="logo" className="header-icon" />
        <h2>{translations[lang].title}</h2>
      </div>
      <h3>{translations[lang].subTitle}</h3>
    </header>
  );
};

export default Header;





