import { Button, Form, Input, List, Modal, Select, Space } from "antd";
import styled from "./UpdateModal.module.css";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import {
  ProjectsType,
  TaskType,
  updateProjectsType,
  WorkersType,
} from "../../pages/MainPage/MainPage";

interface UpdateModalProps {
  workers: WorkersType[];
  projectId?: string;
  isOpen: boolean;
  handleCloseModal: () => void;
  updateProjects: updateProjectsType;
}

const UpdateModal: FC<UpdateModalProps> = ({
  workers,
  projectId,
  isOpen,
  handleCloseModal,
  updateProjects,
}) => {
  const [projectNameTitle, setProjectNameTitle] = useState("");
  const [projectWorkerIds, setProjectWorkerIds] = useState<string[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [projectTasks, setProjectTasks] = useState<TaskType[]>([]);
  let defaultProjectValue = useRef<ProjectsType | null>(null);

  const handleChangeProjectName = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectNameTitle(e.target.value);
  };

  const handleTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(event.target.value);
  };

  const handleChangeProjectWorkers = (value: string[]) => {
    setProjectWorkerIds(value);
  };

  const handleAddTask = (title: string) => {
    setProjectTasks([
      ...projectTasks,
      { id: String(Math.random()), title, complete: false },
    ]);
    setTaskTitle("");
  };

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${projectId}`)
      .then((response) => response.json())
      .then((project: ProjectsType) => {
        setProjectWorkerIds(project.workerIds);
        setProjectNameTitle(project.name);
        setProjectTasks(project.tasks);
        defaultProjectValue.current = project;
      });
  }, [projectId]);

  const handleCancelButton = () => {
    if (defaultProjectValue.current) {
      setProjectTasks(defaultProjectValue.current?.tasks);
      setProjectNameTitle(defaultProjectValue.current?.name);
      setProjectWorkerIds(defaultProjectValue.current?.workerIds);
      setTaskTitle("");
      handleCloseModal();
    }
  };

  const handleSwitchTaskComplete = (id: string) => {
    setProjectTasks(
      projectTasks.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setProjectTasks(projectTasks.filter((item) => item.id !== id));
  };

  type handleUpdateProjectType = (
    id: string,
    name: string,
    workerIds: string[],
    tasks: TaskType[]
  ) => void;

  const handleUpdateProject: handleUpdateProjectType = (
    id,
    name,
    workerIds,
    tasks
  ) => {
    const project = {
      name: name.trim(),
      workerIds,
      tasks,
    };

    fetch(`http://localhost:3000/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
      .then((response) => response.json())
      .then((project) => updateProjects(project, "update"));

    handleCloseModal();
  };

  return (
    <Modal
      title="Изменить проект"
      open={isOpen}
      okText="Применить"
      cancelText="Отмена"
      onCancel={handleCancelButton}
      onOk={() => {
        if (projectId) {
          handleUpdateProject(
            projectId,
            projectNameTitle,
            projectWorkerIds,
            projectTasks
          );
        }
      }}
    >
      <Form>
        <Form.Item label="Название:">
          <Input value={projectNameTitle} onChange={handleChangeProjectName} />
        </Form.Item>
        <Form.Item label="Участники:">
          <Select
            allowClear
            mode="multiple"
            value={projectWorkerIds}
            onChange={handleChangeProjectWorkers}
            options={workers.map((worker) => ({
              label: worker.name,
              value: worker.id,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item label="Задачи:">
          <Space.Compact className={styled.taskInput}>
            <Input value={taskTitle} onChange={handleTaskTitle} />
            <Button
              onClick={() => handleAddTask(taskTitle.trim())}
              type="primary"
            >
              Добавить
            </Button>
          </Space.Compact>
          <List
            size="default"
            bordered
            dataSource={projectTasks}
            renderItem={(item) => (
              <List.Item>
                <div key={item.id} className={styled.taskList}>
                  <div>{item.title}</div>
                  <div className={styled.buttonsContainer}>
                    <Button onClick={() => handleSwitchTaskComplete(item.id)}>
                      {item.complete ? "Возобновить" : "Завершить"}
                    </Button>
                    <Button onClick={() => handleDeleteTask(item.id)}>
                      удалить
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
