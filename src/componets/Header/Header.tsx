import styled from "./Header.module.css";

const Header = () => {
  return (
    <header className={styled.header}>
      <h2 className={styled.logo}>CHGRM</h2>
    </header>
  );
};

export default Header;
