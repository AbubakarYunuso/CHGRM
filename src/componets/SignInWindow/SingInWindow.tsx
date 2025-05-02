import { Button, Form, Input, Typography } from "antd";
import styled from "./SingInWindow.module.css";
import { ChangeEvent, FC, useState } from "react";
import { WorkersType } from "../../pages/MainPage/MainPage";

export interface SingInWindowProps {
  workers: WorkersType[];
}

const SingInWindow: FC<SingInWindowProps> = ({ workers }) => {
  const [loginTitle, setLoginTitle] = useState("");
  const [passwordTitle, setPasswordTitle] = useState("");

  const handleAuthInSystem = (login: string, password: string) => {
    let worker = workers.find((worker) => worker.login === login);

    if (!worker) {
      alert("Неверный логин");
      return;
    }
    if (worker?.password !== password) {
      alert("Неверный пароль");
      return;
    }

    localStorage.setItem("token", JSON.stringify(worker));
    location.reload();
  };

  return (
    <div className={styled.container}>
      <h2 className={styled.header}>Войти в систему</h2>
      <Form className={styled.form}>
        <Form.Item className={styled.formItem}>
          <Typography.Title level={5}>Логин</Typography.Title>
          <Input
            value={loginTitle}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setLoginTitle(event.target.value)
            }
          />
        </Form.Item>
        <Form.Item>
          <Typography.Title level={5}>Пароль</Typography.Title>
          <Input.Password
            value={passwordTitle}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPasswordTitle(event.target.value)
            }
          />
        </Form.Item>
        <Button
          onClick={() => handleAuthInSystem(loginTitle, passwordTitle)}
          size="large"
          type="primary"
        >
          Войти
        </Button>
      </Form>
    </div>
  );
};
export default SingInWindow;
