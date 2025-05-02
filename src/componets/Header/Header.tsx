import { FC } from "react";
import styled from "./Header.module.css";
import { List, Popover } from "antd";

const Header: FC<{ name: string }> = ({ name }) => {
  const handleExitProfile = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <header className={styled.header}>
      <Popover
        content={
          <>
            <List className={styled.popup}>
              <List.Item id={styled.exit} onClick={handleExitProfile}>
                Выйти
              </List.Item>
            </List>
          </>
        }
        trigger="click"
      >
        <div className={styled.userIcon}>{name}</div>
      </Popover>
      <h2 className={styled.logo}>CHGRM</h2>
    </header>
  );
};

export default Header;
