// components/MenuButton.tsx
import React from "react";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <button className="menu-button" onClick={onClick}>
      ☰
    </button>
  );
};

export default MenuButton;
