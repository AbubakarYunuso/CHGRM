import { FC, Fragment, useState } from "react";
import { Card } from "antd";
import styled from "./Projects.module.css";
import {
  ProjectsType,
  updateProjectsType,
  WorkersType,
} from "../../pages/MainPage/MainPage";
import UpdateModal from "../UpdateModal/UpdateModal";

export interface ProjectsProps {
  projects: ProjectsType[];
  workers: WorkersType[];
  updateProjects: updateProjectsType;
}

const Projects: FC<ProjectsProps> = ({ projects, workers, updateProjects }) => {
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [projectId, setProjectId] = useState("");

  const handleOpenUpdateModal = (projectId: string) => {
    setIsOpenUpdateModal(true);
    setProjectId(projectId);
  };

  const handleCloseModal = () => {
    setIsOpenUpdateModal(false);
  };

  return (
    <div className={styled.projectsContainer}>
      {projects.map(({ id, headWorkerId, workerIds, name, tasks }) => (
        <Fragment key={id}>
          <Card onClick={() => handleOpenUpdateModal(id)} title={name}>
            <dl className={styled.cardContant}>
              <div className={styled.list}>
                <h3>Руководитель:</h3>
                <dd className={styled.listSecondItem}>
                  {workers.find((worker) => worker.id === headWorkerId)?.name}
                </dd>
              </div>

              <div className={styled.list}>
                <h3>Участники:</h3>
                <dd className={styled.listSecondItem}>
                  {workers
                    .filter((worker) => workerIds.includes(worker.id))
                    .map((worker) => (
                      <div key={worker.id}>{worker.name}</div>
                    ))}
                </dd>
              </div>

              <div className={styled.list}>
                <h3>Прогресс:</h3>
                <dd className={styled.listSecondItem}>
                  {tasks.filter((task) => task.complete).length === tasks.length
                    ? "Завершен"
                    : `${Math.floor(
                        (100 / tasks.length) *
                          tasks.filter((task) => task.complete).length
                      )}%`}
                </dd>
              </div>
            </dl>
          </Card>
        </Fragment>
      ))}
      <UpdateModal
        updateProjects={updateProjects}
        handleCloseModal={handleCloseModal}
        isOpen={isOpenUpdateModal}
        projectId={projectId}
        workers={workers}
      />
    </div>
  );
};

export default Projects;
