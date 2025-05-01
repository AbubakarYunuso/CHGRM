import { Button, Menu } from "antd";
import { Link } from "react-router";
import styled from "./MainPage.module.css";
import Header from "../../componets/Header/Header";
import Projects from "../../componets/Projects/Projects";
import { useCallback, useEffect, useState } from "react";
import CreateModal from "../../componets/CreateModal/CreateModal";

export interface TaskType {
  id: string;
  title: string;
  complete: boolean;
}

export interface WorkersType {
  id: string;
  name: string;
  isRukovod: boolean;
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
      }
    );
  }, []);

  const MuneItems = [
    {
      key: 1,
      label: <Link to="/">Проекты</Link>,
    },
    {
      key: 2,
      label: <Link to="/workers">Рабочие</Link>,
    },
  ];

  return (
    <>
      <Header />

      <div className={styled.mainContant}>
        <div>
          <Menu
            className={styled.menu}
            theme="light"
            mode="inline"
            items={MuneItems}
          />
          <Button
            onClick={() => handleOpenAndCloseCreateModal(true)}
            className={styled.createButton}
            type="text"
          >
            Создать проект
          </Button>
        </div>

        <Projects
          updateProjects={updateProjects}
          projects={projects}
          workers={workers}
        />
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
