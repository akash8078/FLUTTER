import React from 'react';
import './card_react.css';

const CardReact = ({ title, subtitle, content, imageUrl, buttonText, onButtonClick }) => {
  return (
    <div className="card">
      <div className="card-header">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="card-image" />
        )}
      </div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        <p className="card-content">{content}</p>
      </div>
      <div className="card-footer">
        {buttonText && (
          <button className="card-button" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardReact;