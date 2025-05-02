import { Button, Menu } from "antd";
import { Link, Route, Routes } from "react-router";
import styled from "./MainPage.module.css";
import Header from "../../componets/Header/Header";
import Projects from "../../componets/Projects/Projects";
import { useCallback, useEffect, useRef, useState } from "react";
import CreateModal from "../../componets/CreateModal/CreateModal";
import SingInWindow from "../../componets/SignInWindow/SingInWindow";
import Workers from "../../componets/Workers/Workers";

export interface TaskType {
  id: string;
  title: string;
  complete: boolean;
}

export interface WorkersType {
  id: string;
  name: string;
  isRukovod: boolean;
  login: string;
  password: string;
  specialization: string;
}

export interface ProjectsType {
  id: string;
  name: string;
  headWorkerId: string;
  workerIds: string[];
  tasks: TaskType[];
}

export type updateProjectsType = (
  project: ProjectsType,
  variant: "update" | "post"
) => void;

const MainPage = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [projects, setProjects] = useState<ProjectsType[]>([]);
  const [workers, setWorkers] = useState<WorkersType[]>([]);
  let token = JSON.parse(String(localStorage.getItem("token")));
  const defaultProject = useRef<ProjectsType[]>(null);

  const handleOpenAndCloseCreateModal = useCallback((value: boolean) => {
    setIsOpenCreateModal(value);
  }, []);

  const updateProjects: updateProjectsType = (
    project: ProjectsType,
    variant: "update" | "post" = "post"
  ) => {
    if (variant === "post") {
      setProjects([...projects, project]);
      return;
    }
    if (variant === "update") {
      setProjects(
        projects.map((actualProject) =>
          actualProject.id === project.id ? project : actualProject
        )
      );
      return;
    }
  };

  useEffect(() => {
    const urls = [
      "http://localhost:3000/projects",
      "http://localhost:3000/workers",
    ];

    Promise.all(urls.map((url) => fetch(url).then((data) => data.json()))).then(
      ([projects, workers]) => {
        setProjects(projects);
        setWorkers(workers);
        defaultProject.current = projects;
      }
    );
  }, []);

  const handleMyProjects = () => {
    setProjects(
      projects.filter((project) => project.headWorkerId === token.id)
    );
  };

  const MuneItems = [
    {
      key: 1,
      label: <Link to="/">Проекты</Link>,
      children: [
        {
          key: 2,
          label: (
            <Link
              onClick={() =>
                setProjects(
                  defaultProject.current !== null ? defaultProject.current : []
                )
              }
              to="/"
            >
              Все проекты
            </Link>
          ),
        },
        {
          key: 3,
          label: (
            <Link onClick={handleMyProjects} to="/">
              Мои проекты
            </Link>
          ),
        },
      ],
    },
    {
      key: 4,
      label: <Link to="/workers">Рабочие</Link>,
    },
  ];

  if (!token) {
    return <SingInWindow workers={workers} />;
  }

  return (
    <>
      <Header name={token.name} />

      <div className={styled.mainContant}>
        <div>
          <Menu
            className={styled.menu}
            theme="light"
            mode="inline"
            items={MuneItems}
          />
          {token.isRukovod && (
            <Button
              onClick={() => handleOpenAndCloseCreateModal(true)}
              className={styled.createButton}
              type="text"
            >
              Создать проект
            </Button>
          )}
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <Projects
                updateProjects={updateProjects}
                projects={projects}
                workers={workers}
              />
            }
          />
          <Route
            path="/workers"
            element={<Workers defaultWorkers={workers} />}
          />
        </Routes>
      </div>

      <CreateModal
        updateProjects={updateProjects}
        workers={workers}
        isOpen={isOpenCreateModal}
        handleCloseModal={handleOpenAndCloseCreateModal}
      />
    </>
  );
};

export default MainPage;
